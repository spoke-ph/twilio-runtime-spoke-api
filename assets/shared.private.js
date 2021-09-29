const axios = require("axios");

const httpResponse = (statusCode, data, callback) => {
  const response = new Twilio.Response(); //TODO ignore or add Twilio to globales
  // CORS header required to allow Flex access to this function
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");
  response.setStatusCode(statusCode);
  response.setBody(data);
  return callback(null, response);
};

const getAccessToken = async (context) => {
  const clientId = context.SPOKE_CLIENT_ID;
  const clientSecret = context.SPOKE_CLIENT_SECRET;
  const authServiceUrl = context.SPOKE_AUTH_SERVICE_URL;

  if (!clientId || !clientSecret || !authServiceUrl) {
    return {
      success: false,
      error: "Missing environment configuration for Spoke API connection"
    };
  }

  try {
    const tokenResponse = await axios(authServiceUrl, {
      method: "POST",
      data: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials"
      },
      headers: { "Content-Type": "application/json" }
    });
    const { access_token } = tokenResponse.data;
    return { success: true, accessToken: access_token };
  } catch (error) {
    console.log("ERROR", error);
    return { success: false, error };
  }
};

const withAccessToken = (handlerFunction) => {
  return async (context, event, callback) => {
    console.debug("[spoke:withAccessToken] Getting Spoke API access token");
    const { success, accessToken, error } = await getAccessToken(context);

    if (!success) {
      console.error("[spoke:withAccessToken] Failed to retrieve Spoke API access token", { error });
      return httpResponse(401, { errorMessage: error.toString() }, callback);
    }
    console.debug("[spoke:withAccessToken] Got access token, calling handler function");
    return await handlerFunction({ context, event, callback, accessToken });
  };
};

const apiRequestHeaders = (accessToken) => {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "User-Agent": "Twilio Runtime",
    "Cache-Control": "no-cache"
  };
};

module.exports = { httpResponse, withAccessToken, apiRequestHeaders };
