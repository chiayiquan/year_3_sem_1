import db, { generateID } from "../src/db";
import env from "../src/env";
import knexConfig from "../db/knexfile";
import User from "../src/libs/User";
import Session from "../src/libs/Session";
import JWT from "../src/libs/JWT";
// import jwt from "jsonwebtoken";
import moment from "moment";

export { db, env, generateID }; // for other test case easier for import

afterAll(async () => {
  await db.destroy();
});

export async function cleanDb(): Promise<void> {
  const migrationTableNames = [
    knexConfig.migrations.tableName,
    knexConfig.migrations.tableName + "_lock",
  ]
    .map((s) => `'${s}'`)
    .join(",");

  await db
    .raw(
      `SELECT relname AS tablename FROM pg_class
        WHERE relkind = 'r'
        AND relnamespace = 'public'::regnamespace
        AND relname NOT IN (${migrationTableNames})`
    )
    .then((response) => {
      return response.rows.map((row: { tablename: string }) => row.tablename);
    })
    .then((tablenames: string[]) => {
      console.log(
        `TRUNCATE TABLE ${tablenames.map((s) => `"${s}"`).join(",")} CASCADE`
      );
      return db.raw(
        `TRUNCATE TABLE ${tablenames.map((s) => `"${s}"`).join(",")} CASCADE`
      );
    });
}

export async function createUser(
  userData: {
    [key: string]: string | null | number;
  } = {}
) {
  const user = {
    name: "test",
    email: "test@example.com",
    password: "123456789",
    id: generateID(),
    createdAt: moment().unix(),
    handler: "unique_user",
    loginType: "ACCOUNT",
    ...userData,
  };
  const password =
    user.password != null && (await User.hashPassword(user.password));
  await db.insert({ ...user, password }).into("users");
  const jwt = await createJWT(user.id, null);
  return { user, jwt };
}

export async function createJWT(id: string, authToken: string | null) {
  const session = await Session.createSession(id, authToken);
  return session && JWT.issue(session.id, session.userId);
}

export async function createTask(
  taskData: { [key: string]: string | null | number } = {},
  userId: string,
  participants: string[] = [userId],
  users: { [key: string]: string | null | number }[]
) {
  const taskId = generateID();
  const task = {
    id: taskId,
    name: "randomTask",
    datetimeStart: moment().unix(),
    datetimeEnd: moment().add(3, "hours").unix(),
    location: "random-place",
    description: "just some test word",
    status: "confirmed",
    createdBy: userId,
    createdAt: moment().unix(),
    ...taskData,
  };

  const taskParticipantsList = participants.map((participantUserId) => ({
    id: generateID(),
    taskId,
    userId: participantUserId,
    status: "accepted",
    readNotification: false,
  }));

  await db.insert(task).into("tasks");
  await db.insert(taskParticipantsList).into("participants");
  return {
    task,
    participants: taskParticipantsList.map((participant) => ({
      id: participant.id,
      taskId: participant.taskId,
      status: participant.status,
      readNotification: participant.readNotification,
      user: users.filter((user) => user.id === participant.userId)[0],
    })),
  };
}

export async function generateFriends(userId: string) {
  const [{ user: firstFriend }, { user: secondFriend }] = await Promise.all([
    createUser({
      email: `${generateRandomText()}@example.com`,
      handler: `${generateRandomText()}@example.com`,
    }),
    createUser({
      email: generateRandomText(),
      handler: generateRandomText(),
    }),
  ]);

  const firstId = generateID();
  const secondId = generateID();

  const firstRequestedDate = moment().unix();
  const secondRequestedDate = moment().unix();

  await db
    .insert({
      id: firstId,
      from: userId,
      to: firstFriend.id,
      status: "accepted",
      requestedDate: firstRequestedDate,
    })
    .into("friends");
  await db
    .insert({
      id: secondId,
      from: secondFriend.id,
      to: userId,
      status: "accepted",
      requestedDate: secondRequestedDate,
    })
    .into("friends");
  return [
    {
      id: firstId,
      from: userId,
      to: {
        name: firstFriend.name,
        email: firstFriend.email,
        handler: firstFriend.handler,
        id: firstFriend.id,
      },
      status: "accepted",
      requestedDate: firstRequestedDate,
    },
    {
      id: secondId,
      from: {
        name: secondFriend.name,
        email: secondFriend.email,
        handler: secondFriend.handler,
        id: secondFriend.id,
      },
      to: userId,
      status: "accepted",
      requestedDate: secondRequestedDate,
    },
  ];
}

function generateRandomText() {
  let text = "";
  const possibleLetter =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 10; i++)
    text += possibleLetter.charAt(
      Math.floor(Math.random() * possibleLetter.length)
    );

  return text;
}
