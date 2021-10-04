global.Twilio = {

};

global.Twilio.Response = function() {
  this.headers = [];
  this.body = null;
  this.setBody = value => {
    this.body = value;
  };
  this.setStatusCode = value => {
    this.statusCode = value;
  };
  this.appendHeader = (key, value) => {
    this.headers.push({ key: value });
  };
};

const fakeTwilioResponse = (error, response) => {
  if (error) {
    return error;
  }
  return response;
};

module.exports = { fakeTwilioResponse };
