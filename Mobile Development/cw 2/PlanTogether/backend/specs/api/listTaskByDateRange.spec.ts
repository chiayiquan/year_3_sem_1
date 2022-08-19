import request from "supertest";
import app from "../../src/app";
import * as Test from "../helper";
import moment from "moment";

const getUserTaskApi = async (
  jwt: string | null,
  dateRange: number[],
  responseStatus: number
): Promise<request.Test> => {
  return request(app)
    .get(`/get-user-task/${dateRange.join(",")}`)
    .set("Authorization", `Bearer ${jwt}`)
    .expect("Content-Type", /json/)
    .expect(responseStatus);
};

const firstDay = moment(
  moment().startOf("month").format("YYYY-MM-DD hh:mm").valueOf()
).unix();
const lastDay = moment(
  moment().endOf("month").format("YYYY-MM-DD hh:mm").valueOf()
).unix();

describe("Test for listTaskByDateRange", function () {
  beforeAll(async () => {
    await Test.cleanDb();
  });
  describe("Test get for /get-user-task", function () {
    it("should return error when there invalid session", async () => {
      const response = await getUserTaskApi(
        "invalid-jwt",
        [firstDay, lastDay],
        400
      );
      expect(response.body.error.code).toBe("UNEXPECTED_ERROR");
    });
    it("should be able to retrieve user tasks", async () => {
      const [{ user, jwt }, { user: tester1 }, { user: tester2 }] =
        await Promise.all([
          Test.createUser(),
          Test.createUser({ email: "test1@example.com", name: "tester1" }),
          Test.createUser({ email: "test2@example.com", name: "tester2" }),
        ]);
      const tasks = await Promise.all([
        Test.createTask(
          {},
          user.id,
          [user.id],
          [
            {
              id: user.id,
              handler: user.handler,
              name: user.name,
              email: user.email,
            },
          ]
        ),
        Test.createTask(
          {
            name: "new task 1",
            location: "home",
            description: "some random desc",
          },
          user.id,
          [user.id],
          [
            {
              id: user.id,
              handler: user.handler,
              name: user.name,
              email: user.email,
            },
          ]
        ),
        Test.createTask(
          {
            name: "task with multiple people",
            location: "shopping mall",
            description: "meet up",
          },
          user.id,
          [user.id, tester1.id, tester2.id],
          [
            {
              id: user.id,
              handler: user.handler,
              name: user.name,
              email: user.email,
            },
            {
              id: tester1.id,
              handler: tester1.handler,
              name: tester1.name,
              email: tester1.email,
            },
            {
              id: tester2.id,
              handler: tester2.handler,
              name: tester2.name,
              email: tester2.email,
            },
          ]
        ),
      ]);

      const response = await getUserTaskApi(jwt, [firstDay, lastDay], 200);

      const responseData = response.body.data;

      tasks.forEach(({ task }) => {
        const filteredTask = responseData.filter(
          (obj: any) => task.id === obj.task.id
        )[0];
        expect(responseData).toContainEqual(filteredTask);
      });
    });

    it("should return error when daterange is have 1 value or more than 2", async () => {
      const testUser3 = await Test.createUser({
        email: "test3@example.com",
        name: "tester3",
      });
      const oneValueResponse = await getUserTaskApi(
        testUser3.jwt,
        [firstDay],
        400
      );
      expect(oneValueResponse.body.error.code).toBe("INVALID_DATE_RANGE");
      const threeValueResponse = await getUserTaskApi(
        testUser3.jwt,
        [firstDay, lastDay, lastDay],
        400
      );
      expect(threeValueResponse.body.error.code).toBe("INVALID_DATE_RANGE");
    });
  });
});
