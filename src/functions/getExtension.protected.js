const axios = require("axios");

/**
 * Twilio serverless runtime only has a simple shared module approach, using private assets
 * deployed under the "assets" folder.
 */
const path = Runtime.getAssets()["/shared.js"].path;
const { httpResponse, withAccessToken, spokeApiRequestHeaders } = require(path);

async function getExtension({ context, event, callback, accessToken }) {
  try {
    const apiUrl = context.SPOKE_API_URL;
    const { extension } = event;
    const queryUrl = `${apiUrl}/directory?extension=${extension}`;
    console.debug("[spoke:getExtension] Calling directory API", { queryUrl, extension });

    const directoryResponse = await axios(queryUrl, {
      method: "GET",
      headers: spokeApiRequestHeaders(accessToken)
    });

    console.debug("[spoke:getExtension] Directory response", { data: directoryResponse.data });
    const { entries } = directoryResponse.data;
    /**
     * There is a one to one mapping from extension to directory entry. Directory API response will
     * always return an array.
     */
    const [directoryEntry] = entries;

    if (!directoryEntry) {
      console.debug("[spoke:getExtension] Directory entry not found", { extension });
      return httpResponse(404, { errorMessage: `Extension ${extension} not found` }, callback);
    }

    /**
     * The attributes below are documented at https://developer.spokephone.com under
     * `GET Directory`. The fields below are destructured as an example. Any of the
     * fields documented in the API can also be included.
     */
    const {
      displayName,
      type,
      availability: { status, availabilitySummary } = {},
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
