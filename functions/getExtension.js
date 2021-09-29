const R = require("ramda");
const axios = require("axios");

/**
 * Twilio serverless runtime only has a simple shared module approach, using private assets
 * deployed under the "assets" folder.
 */
const path = Runtime.getAssets()["/shared.js"].path;
const { httpResponse, withAccessToken, apiRequestHeaders } = require(path);

async function getExtension({ context, event, callback, accessToken }) {
  const apiUrl = context.SPOKE_API_URL;
  const { extension } = event;
  const queryUrl = `${apiUrl}/directory?extension=${extension}`;
  console.debug("[spoke:getExtension] Calling directory API", { queryUrl, extension });

  try {
    const directoryResponse = await axios(queryUrl, {
      method: "GET",
      headers: apiRequestHeaders(accessToken)
    });

    console.debug("[spoke:getExtension] Directory response", { data: directoryResponse.data });
    const { entries } = directoryResponse.data;
    const directoryEntry = R.head(entries);

    if (!directoryEntry) {
      console.debug("[spoke:getExtension] Directory entry not found", { extension });
      return httpResponse(404, { errorMessage: `Extension ${extension} not found` }, callback);
    }

    const {
      displayName,
      type,
      availability: { status, availabilitySummary },
      twimlRedirectUrl
    } = directoryEntry;

    return httpResponse(
      200,
      { extension, displayName, type, status, availabilitySummary, twimlRedirectUrl },
      callback
    );
  } catch (error) {
    console.error("[spoke:getExtension] Error", error);
    return httpResponse(401, {
      success: false,
      errorMessage: error.toString()
    }, callback);
  }
}

exports.handler = withAccessToken(getExtension);
