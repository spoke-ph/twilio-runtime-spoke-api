# twilio-runtime-spoke-api
Twilio Runtime serverless functions for the Spoke Developer API.

## Overview
This repository contains a series of functions that make it easy to connect the Spoke API to Twilio applications such as Twilio Studio and Flex. Using this API allows you to integrate Spoke's programmable softphone app with any Twilio application that is hosted in the same account.

## Prerequisites

1. Twilio Account or Project
2. Spoke Account - signup for a free developer account in 2 minutes at https://account.spokephone.com/signup?vendor=twilio

  * You will need your twilio account sid and auth token to complete the signup flow
  * Due to Twilio's restrictions on cross-account calling, it's important to use the same account or project for Spoke that you host your Studio flow or other Twilio application.
3. Spoke Developer API credentials - get these from https://account.spokephone.com/developer-api
4. NodeJS 12, NPM 6 installed locally
5. Twilio CLI installed locally - https://www.twilio.com/docs/twilio-cli/quickstart
6. Twilio Serverless Plugin installed locally - https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit

## Deploy

1. Checkout and install

Checkout this codebase to your local machine, and install required npm packages

```
git clone https://github.com/spoke-ph/twilio-runtime-spoke-api.git
cd twilio-runtime-spoke-api
npm i
```

2. Twilio account credentials

Setup your twilio account credentials using the Twilio CLI


```
twilio login
twilio profiles:use {YOUR_ACCOUNT}
```

2. Spoke Developer API Credentials

Twilio's serverless deploy process will automatically upload any environment variables in your `.env` file to the Twilio service. Update `.env` with the following values using your favourite editor. The values for `YOUR_SPOKE_CLIENT_ID` and `YOUR_SPOKE_CLIENT_SECRET` are provided to you when you create a Developer API in your Spoke account:

```
SPOKE_CLIENT_ID={YOUR_SPOKE_CLIENT_ID}
SPOKE_CLIENT_SECRET={YOUR_SPOKE_CLIENT_SECRET}
SPOKE_AUTH_SERVICE_URL=https://auth.spokephone.com/oauth/token
SPOKE_API_URL=https://integration.spokephone.com
```

3. Deploy

The deploy process will create a new Twilio Runtime service in your Spoke account called `spoke-api-service`.  The functions and environment variables in this project will be deployed into this service.

```
twilio serverless:deploy
```

4. Check setup

Login to your project in the Twilio console, and go to the Develop --> Functions --> Services page. Click on the `spoke-api-service` service, then click on `Environment Variables` near the bottom of the page.

## Usage Guide

These functions are designed to be a quickstart to get you up and running quickly.

The functions in the `src/assets/shared.private.js` are helper functions that make it easy to get an access token from the Spoke Auth service, and generate the correct type of HTTP response when function execution completes.

If you want to write a new function that uses the Spoke API, make sure you follow the method signature and export pattern below. This ensures that the

```javascript
const axios = require("axios");

const path = Runtime.getAssets()["/shared.js"].path;
const { httpResponse, withAccessToken, spokeApiRequestHeaders } = require(path);

async function mySpokeAPIFunction({ context, event, callback, accessToken }) {
  try {
    const apiUrl = context.SPOKE_API_URL;
    const { extension } = event;
    const queryUrl = `${apiUrl}/`; // modify the queryUrl to meet your own requirements

    const apiResponse = await axios(queryUrl, {
      method: "GET",
      headers: spokeApiRequestHeaders(accessToken)
    });

    /* insert your custom logic here */

    const result = {}; // add your result attributes
    return httpResponse(
      200,
      result,
      callback
    );
  } catch (error) {
    console.error("[mySpokeAPIFunction] Error", error);
    return httpResponse(401, {
      success: false,
      errorMessage: error.toString()
    }, callback);
  }
}

exports.handler = withAccessToken(mySpokeAPIFunction);
```

## Documentation and Support

* The Spoke API documentation is available at https://developer.spokephone.com
* Spoke support and user guides are available at https://support.spokephone.com
