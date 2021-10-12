# twilio-runtime-spoke-api

[![Spoke](https://circleci.com/gh/spoke-ph/twilio-runtime-spoke-api.svg?style=shield&circle-token=a7dc9f31cfd84f78656a5bcfeaf12834a44a732a)]()

Twilio Runtime serverless functions for the Spoke Developer API.

## Overview
This repository contains quickstart functions that make it easy to interconnect the Spoke Developer API with Twilio applications such as Studio and Flex. Using this API allows you to integrate Spoke's programmable softphone app with any Twilio application that is hosted in the same account.

## Features

* Automatic & secure management of Spoke OAuth 2.0 access tokens
* Get Spoke directory entries by extension
* Lookup `twimlRedirectURL` for a Spoke extension
* List all directory entries (by page)
* Functions are immediately available from within Twilio Studio to easily integrate Spoke Users, Groups and Devices to your Studio flows

## Prerequisites

1. Twilio Account or Project
2. Spoke Account: Signup for a free developer account at https://account.spokephone.com/signup?vendor=twilio. You will need your twilio account sid and auth token to complete the signup flow
3. Spoke Developer API credentials - get these from https://account.spokephone.com/developer-api
4. NodeJS 12, NPM 6 installed locally
5. Twilio CLI installed locally - https://www.twilio.com/docs/twilio-cli/quickstart
6. Twilio Serverless Plugin installed locally - https://www.twilio.com/docs/labs/serverless-toolkit/getting-started#install-the-twilio-serverless-toolkit

## Deploy

### 1. Checkout and install

Checkout this codebase to your local machine, and install required npm packages

```bash
$ git clone https://github.com/spoke-ph/twilio-runtime-spoke-api.git
$ cd twilio-runtime-spoke-api
$ npm i
```

### 2. Twilio account credentials

Setup your twilio account credentials using the Twilio CLI.

```bash
$ twilio login
$ twilio profiles:use {YOUR_ACCOUNT}
```

The `twilio profiles:use` command instructs the Twilio CLI to use the twilio account credentials you provided in `twilio login` when running subsequent Twilio CLI commands.

> Note: You can see your local list of twilio profiles with `twilio profiles:list`

### 3. Spoke Developer API Credentials

Twilio's serverless deploy process will automatically upload any environment variables in your `.env` file to the Twilio service.

This project includes an example of this file, `.env.example`. Make a copy of `.env.example`, rename it to `.env` and then update the following values using your favourite editor. The values for `YOUR_SPOKE_CLIENT_ID` and `YOUR_SPOKE_CLIENT_SECRET` are provided to you when you create a Developer API in your Spoke account:

```
SPOKE_CLIENT_ID={YOUR_SPOKE_CLIENT_ID}
SPOKE_CLIENT_SECRET={YOUR_SPOKE_CLIENT_SECRET}
SPOKE_AUTH_SERVICE_URL=https://auth.spokephone.com/oauth/token
SPOKE_API_URL=https://integration.spokephone.com
```

### 4. Deploy

The deploy step uses the Twilio CLI with the credentials provided in Step 2 to create a new Twilio Runtime service in your Spoke account called `spoke-api-service`.  The functions in this project, and environment variables you created in your `.env` file in Step 3 will be deployed into this service.

```bash
$ npm run deploy
```
When deployment has finished, the Twilio Serverless URL for the application will be printed to the console. This URL can be used to access the application, for example:

`Deployed to: https://spoke-api-service-1234-dev.twil.io`

### 5. Check setup

Login to your project in the Twilio console, and go to the Develop --> Functions --> Services page. Click on the `spoke-api-service` service, then click on `Environment Variables` near the bottom of the page. Make sure that `SPOKE_CLIENT_ID`, `SPOKE_CLIENT_SECRET`, `SPOKE_AUTH_SERVICE_URL`, `SPOKE_API_URL` are correctly set.

## Local Development
You can start a local development server by running the following command:

```bash
$ npm run start
```

## Tests
Run `npm test` to run all unit tests.

## Usage Guide

These functions are designed to be a quickstart to get you up and running quickly.

The functions in the `src/assets/shared.private.js` are helper functions that make it easy to get an access token from the Spoke Auth service, and generate the correct type of HTTP response when function execution completes.

If you want to write a new function that uses the Spoke API, make sure you follow the method signature and export pattern below. This ensures that the http request to the Spoke API has a valid access token.

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

## Security

This project follows the Twilio Runtime private/protected/public model:

* Files named `*.private.js` are only accessible by other assets/modules within the same service
* Files named `*.protected.js` are accessible by other Twilio applications within the same project, including webhook handlers and Twilio Studio.  The serverless runtime will take care of validating the request signature of the incoming HTTP request
* Files not following the above two conventions are publicly accessible. We strongly encourage you **NOT** to make functions publicly accessibly without some other form of authentication mechanism as you can potentially expose sensitive information.

## Related

* The Spoke API documentation is available at https://developer.spokephone.com
* Spoke support and user guides are available at https://support.spokephone.com

## License

See the [LICENSE](LICENSE) file for details.
