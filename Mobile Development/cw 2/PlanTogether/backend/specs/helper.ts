import db, { generateID } from "../src/db";
import env from "../src/env";
import knexConfig from "../db/knexfile";
import User from "../src/libs/User";
import Session from "../src/libs/Session";
import JWT from "../src/libs/JWT";
// import jwt from "jsonwebtoken";

export { db, env }; // for other test case easier for import

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
    createdAt: Date.now(),
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
