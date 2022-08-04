import request from "supertest";
import app from "../../src/app";
import * as Test from "../helper";

const postRegisterApi = async (
  data: { [key: string]: string | null },
  responseStatus: number
): Promise<request.Test> => {
  return request(app)
    .post("/register")
    .set("Accept", "application/json")
    .send(data)
    .expect("Content-Type", /json/)
    .expect(responseStatus);
};

const user = {
  name: "test",
  email: "test@example.com",
  password: "123456789",
};

describe("Test for register", function () {
  beforeAll(async () => {
    await Test.cleanDb();
  });

  describe("Test post for /register", function () {
    it("should insert new user", async () => {
      const response = await postRegisterApi(user, 200);
      expect(response.body.data).toBe("User created");
    });

    it("test email is invalid", async () => {
      const response = await postRegisterApi({ ...user, email: "TEST@" }, 400);
      expect(response.body.error.code).toBe("INVALID_EMAIL");
    });

    it("test email is not unique", async () => {
      const response = await postRegisterApi(user, 400);
      expect(response.body.error.code).toBe("EMAIL_EXIST");
    });

    it("test email should be stored lowercase", async () => {
      await postRegisterApi({ ...user, email: "UPPERCASE@EXAMPLE.COM" }, 200);
      const email = await Test.db
        .select("email")
        .from("users")
        .where({ email: "uppercase@example.com" })
        .then((row: { email: string }[]) => row[0].email);
      expect(email).not.toBe("UPPERCASE@EXAMPLE.COM");
    });

    it("test password should be encrypted", async () => {
      await postRegisterApi({ ...user, email: "test1@example.com" }, 200);
      const password = await Test.db
        .select("password")
        .from("users")
        .where({ email: "test1@example.com" })
        .then((row: { password: string }[]) => row[0].password);
      expect(password).not.toBe(user.password);
    });

    it("Test missing field", async () => {
      await postRegisterApi({ name: user.name, password: user.password }, 500);
    });
  });
});
