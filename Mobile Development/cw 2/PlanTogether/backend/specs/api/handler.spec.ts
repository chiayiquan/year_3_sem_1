import request from "supertest";
import app from "../../src/app";
import * as Test from "../helper";

const postHandlerApi = async (
  handler: string,
  responseStatus: number
): Promise<request.Test> => {
  return request(app).get(`/check-handler/${handler}`).expect(responseStatus);
};

describe("Test for checking of handler", function () {
  beforeAll(async () => {
    await Test.cleanDb();
  });
  describe("Test post for /check-handler", function () {
    it("should return true", async () => {
      const user = await Test.createUser();
      const response = await postHandlerApi(user.user.handler, 200);

      const responseData = response.body.data;
      expect(responseData).toBeTruthy();
    });
    it("should return false", async () => {
      const response = await postHandlerApi("valid-handler", 200);
      const responseData = response.body.data;
      expect(responseData).toBeFalsy();
    });
  });
});
