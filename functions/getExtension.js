const axios = require("axios");

const path = Runtime.getAssets()["/shared.js"].path;
const { httpResponse, withAccessToken } = require(path);

/**
 * See docs on callback param - callback is not a promise callback - it simply stops execution of
 * the handler and returns the response to the caller.
 */
async function getExtension({ context, event, callback, accessToken }) {
  const apiUrl = context.SPOKE_API_URL;
  const { extension } = event;

  console.debug("[spoke:getExtension] Calling directory API", { extension });

  try {
    const directoryResponse = await axios(`${apiUrl}/directory?extension=${extension}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "User-Agent": "Twilio Runtime",
        "Cache-Control": "no-cache"
      }
    });
    console.debug("[spoke:getExtension] Directory response", { data: directoryResponse.data });
    const { entries } = directoryResponse.data;
    const directoryEntry = entries[0]; // R.head

    if (!directoryEntry) {
      console.debug("[spoke:getExtension] Directory entry not found", { extension });
      return httpResponse(404, { errorMessage: `Extension ${extension} not found` }, callback);
    }

    const { displayName, type, availability: { status, availabilitySummary }, twimlRedirectUrl } = directoryEntry;

    return httpResponse(200, { extension, displayName, type, status, availabilitySummary, twimlRedirectUrl }, callback);
  } catch (error) {
    console.error("[spoke:getExtension] Error", error);
    return httpResponse(401, {
      success: false,
      errorMessage: error.toString()
    }, callback);
  }
}

exports.handler = withAccessToken(getExtension);
