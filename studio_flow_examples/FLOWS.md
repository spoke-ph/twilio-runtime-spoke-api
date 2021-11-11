# Example Studio Flows

## Basic Spoke IVR Flow
A simple IVR flow that welcomes callers, offers them a couple of options and allows them to enter any extension.  The flow uses the Spoke functions and API to check if the extension exists on Spoke, and if so, sends the call over to Spoke from Studio.

## Notes:
* These flows are designed to work with Spoke accounts that follow the configuration guide [here](https://support.spokephone.com/hc/en-us/articles/4412982114061-Step-By-Step-Guide-Creating-The-Ideal-Spoke-Phone-Twilio-Development-and-Demonstration-Environment-Running-Demos-like-a-Pro-). If your account is configured differently (different groups, extensions etc) you'll need to update the flow accordingly.
* Other Flow Examples will be added soon. For example, checking Spoke user or call group availability before sending calls out of Studio to Spoke, and adding ReturnTo parameters to Twilio's Redirect URL that override Spoke voicemail to send unanswered calls back to Studio or Flex Workflows.
