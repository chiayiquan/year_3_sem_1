import request from "supertest";
import app from "../../src/app";
import * as Test from "../helper";

const postLoginApi = async (
  data: { [key: string]: string | null },
  responseStatus: number
): Promise<request.Test> => {
  return request(app)
    .post("/login")
    .set("Accept", "application/json")
    .send(data)
    .expect("Content-Type", /json/)
    .expect(responseStatus);
};

describe("Test for login", function () {
  beforeAll(async () => {
    await Test.cleanDb();
  });
  describe("Test post for /login", function () {
    it("should be able to login", async () => {
      const { user } = await Test.createUser();
      const response = await postLoginApi(
        {
          email: user.email,
          password: user.password,
          loginType: "ACCOUNT",
          authToken: null,
        },
        200
      );

      const reponseData = response.body.data;
      expect(reponseData.email).toBe(user.email);
      expect(reponseData.name).toBe(user.name);
      expect(reponseData.jwt).not.toBeNull();
      expect(reponseData.id).toBe(user.id);
    });

    it("should be able to login with google", async () => {
      const { user } = await Test.createUser({
        email: "tester@example.com",
        password: null,
        loginType: "GOOGLE",
      });
      const response = await postLoginApi(
        {
          email: user.email,
          password: user.password,
          loginType: user.loginType,
          authToken: "google-auth-token",
        },
        200
      );
      console.log(response.body);
      const reponseData = response.body.data;
      expect(reponseData.email).toBe(user.email);
      expect(reponseData.name).toBe(user.name);
      expect(reponseData.jwt).not.toBeNull();
      expect(reponseData.id).toBe(user.id);
    });

    it("should not be able to login with invalid password", async () => {
      const response = await postLoginApi(
        {
          email: "test@example.com",
          password: "1232sd",
          loginType: "ACCOUNT",
          authToken: null,
        },
        400
      );
      expect(response.body.error.code).toBe("INVALID_ACCOUNT");
    });

    it("it should not be able to login with invalid email", async () => {
      const response = await postLoginApi(
        {
          email: "some@example.com",
          password: "12323",
          loginType: "ACCOUNT",
          authToken: null,
        },
        400
      );
      expect(response.body.error.code).toBe("INVALID_ACCOUNT");
    });
  });
});
