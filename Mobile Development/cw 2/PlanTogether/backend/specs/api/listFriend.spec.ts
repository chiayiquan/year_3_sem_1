import request from "supertest";
import app from "../../src/app";
import * as Test from "../helper";

const listFriendApi = async (
  jwt: string | null,
  responseStatus: number
): Promise<request.Test> => {
  return request(app)
    .get("/list-friends")
    .set("Authorization", `Bearer ${jwt}`)
    .expect("Content-Type", /json/)
    .expect(responseStatus);
};

describe("Test for listFriend", function () {
  beforeAll(async () => {
    await Test.cleanDb();
  });
  describe("Test get for /list-friends", function () {
    it("should return error when there invalid session", async () => {
      const response = await listFriendApi("invalid-jwt", 400);
      expect(response.body.error.code).toBe("UNEXPECTED_ERROR");
    });

    it("should return list of friends", async () => {
      const { user, jwt } = await Test.createUser();
      const multipleFriend = await Promise.all([
        Test.generateFriends(user.id),
        Test.generateFriends(user.id),
        Test.generateFriends(user.id),
        Test.generateFriends(user.id),
      ]);

      console.log(multipleFriend);

      const response = await listFriendApi(jwt, 200);
      expect(response.body.data).toMatchObject(
        multipleFriend.flatMap((friend) => friend)
      );
    });
  });
});
