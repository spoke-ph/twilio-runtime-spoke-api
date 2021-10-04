const shared = require("../../src/assets/shared.private");
const nock = require("nock");
const { expect } = require("chai");
const sinon = require("sinon");

const mocks = require("../mocks");

describe("Shared", () => {
  const context = {
    SPOKE_CLIENT_ID: "client_A",
    SPOKE_CLIENT_SECRET: "secret_A",
    SPOKE_AUTH_SERVICE_URL: "https://url_A"
  };

  beforeEach(() => {

  });

  describe("httpResponse", () => {
    it("Should set the correct headers and return the result of calling callback", () => {
      const callback = mocks.fakeTwilioResponse;
      const result = shared.httpResponse(200, "OK", callback);
      expect(result.body).to.equal("OK");
      expect(result.statusCode).to.equal(200);
    });
  });

  describe("getAccessToken", () => {
    beforeEach(() => {
      nock.cleanAll();
    });

    it("Should return error if env is not setup correctly", async () => {
      const context = {
        SPOKE_CLIENT_ID: "client_B"
      };

      const { error } = await shared.getAccessToken(context);

      expect(error).to.equal("Missing environment configuration for Spoke API connection");
    });

    it("Should call the Spoke auth service to get an access token", async () => {
      const access_token = "ABCD1234";

      nock(context.SPOKE_AUTH_SERVICE_URL)
        .post("/")
        .reply(200, { access_token });

      const { accessToken } = await shared.getAccessToken(context);
      expect(accessToken).to.equal(access_token);
    });

    it("Should handle error when getting access token", async () => {
      nock(context.SPOKE_AUTH_SERVICE_URL)
        .post("/")
        .reply(500, { });
      const { error } = await shared.getAccessToken(context);
      expect(error.toString()).to.equal("Error: Request failed with status code 500");
    });
  });

  describe("withAccessToken", () => {
    const event = { param: "123" };
    const callback = () => {};

    it("Should get access token then call the provided handler function", async () => {
      const access_token = "aaa111";
      const handlerResult = "handlerResult";
      const handler = sinon.fake(() => {
        return handlerResult;
      });
      const wrapper = shared.withAccessToken(handler);
      nock(context.SPOKE_AUTH_SERVICE_URL)
        .post("/")
        .reply(200, { access_token });
      const actual = await wrapper(context, event, callback);
      expect(actual).to.equal(handlerResult);
      expect(handler.calledOnceWith({ context, event, callback, accessToken: access_token })).to.be.true;
    });

    it("Should return 401 if getAccessToken is not successful", async () => {
      const wrapper = shared.withAccessToken(() => {});
      nock(context.SPOKE_AUTH_SERVICE_URL)
        .post("/")
        .reply(401);
      const callback = mocks.fakeTwilioResponse;
      const actual = await wrapper(context, event, callback);
      expect(actual.statusCode).to.equal(401);
    });

  });
});
