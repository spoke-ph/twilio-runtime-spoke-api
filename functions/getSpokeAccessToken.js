const path = Runtime.getAssets()["/shared.js"].path;
const { httpResponse, getAccessToken } = require(path);

async function getSpokeAccessToken(context, event, callback) {
  console.debug("[SPOKE] Getting Spoke API access token");
  const { success, accessToken, error } = await getAccessToken(context);
  if (!success) {
    console.error("[SPOKE] Failed to retrieve Spoke API access token", { error })
    return httpResponse(401, {
      success: false,
      errorMessage: error.toString()
    }, callback);
  }

  console.debug("[SPOKE] Success getting Spoke API access token");
  return httpResponse(200, {
    success: true,
    accessToken
  }, callback);
}

exports.handler = getSpokeAccessToken;
