const axios = require("axios");

/**
 * Twilio serverless runtime only has a simple shared module approach, using private assets
 * deployed under the "assets" folder.
 */
const path = Runtime.getAssets()["/shared.js"].path;
const { httpResponse, withAccessToken, apiRequestHeaders } = require(path);

async function listDirectory({ context, event, callback, accessToken }) {
  const apiUrl = context.SPOKE_API_URL;
  const { next, limit } = event;
  try {
    const params = new URLSearchParams();
    next && params.append("next", next);
    limit && params.append("limit", limit);
    const queryUrl = `${apiUrl}/directory?${params.toString()}`;
    console.debug("[spoke:listDirectory] Calling directory API", { queryUrl, next, limit });

    const directoryResponse = await axios(queryUrl, {
      method: "GET",
      headers: apiRequestHeaders(accessToken)
    });

    console.debug("[spoke:listDirectory] Directory response", { data: directoryResponse.data });

    return httpResponse(
      200,
      directoryResponse.data,
      callback
    );
  } catch (error) {
    console.error("[spoke:listDirectory] Error", error);
    return httpResponse(401, {
      success: false,
      errorMessage: error.toString()
    }, callback);
  }
}

exports.handler = withAccessToken(listDirectory);
