# twilio-runtime-spoke-api
Twilio Runtime serverless functions for the Spoke API.

## Overview
This repo contains a series of functions that make it easy to connect the Spoke API to Twilio applications such as Twilio Studio and Flex. Using this APIs allows you to integrate Spoke's programmable softphone app with any Twilio application that is hosted in the same account.

### Prerequisites

* Twilio Account or Project
* Spoke Account - signup for a trial account in 2 minutes at https://account.spokephone.com/signup?vendor=twilio
* Spoke Developer API credentials - get these from https://account.spokephone.com/developer-api
* Twilio CLI installed locally -
* Twilio Serverless Plugin installed locally -

### Deploy

1. Checkout this codebase to your local machine, and install required npm packages

```
git clone
npm i
```

2. Setup your twilio account credentials

```
twilio:login
twilio profiles:use
```

2. Copy env.example to .env
Update .env the following values in .env:

```
SPOKE_CLIENT_ID=YOUR_SPOKE_CLIENT_ID
SPOKE_CLIENT_SECRET=YOUR_SPOKE_CLIENT_SECRET
```

3. Deploy to your Twilio account

```
twilio serverless:deploy
```

### Usage Guide

***Insert user guide here ***


### Documentation and Support

* The Spoke API documentation is available at https://developer.spokephone.com.
* Spoke support and user guides are available at https://support.spokephone.com
