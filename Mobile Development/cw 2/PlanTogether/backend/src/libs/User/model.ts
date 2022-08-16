import db from "../../db";
import * as JD from "decoders";

type LoginType = "GOOGLE" | "ACCOUNT" | "UNKNOWN";

type Schema = Readonly<{
  id: string;
  name: string;
  email: string;
  password: string | null;
  createdAt: number; // timestamp is stored as posix(number) because different timezone won't affect it
  handler: string;
  loginType: LoginType;
}>;

type UserData = Readonly<{
  id: string;
  name: string;
  email: string;
  createdAt: number;
  jwt: string;
  handler: string;
}>;

type UserInfo = Readonly<{
  id: string;
  name: string;
  email: string;
  handler: string;
}>;

async function insert(userInfo: Schema) {
  return db.into("users").insert({ ...userInfo });
}

async function update(
  updateInfo: Partial<Schema>,
  whereClause: Partial<Schema>
) {
  return db.update(updateInfo).from("users").where(whereClause);
}

async function checkEmailExisted(
  email: string,
  loginType: LoginType
): Promise<boolean> {
  return db
    .select("email")
    .from("users")
    .where({ email, loginType })
    .then((row) => row.length > 0);
}

async function get(whereClause: Partial<Schema>): Promise<Schema> {
  return db
    .select()
    .from("users")
    .where(whereClause)
    .then((rows) => decode(rows)[0]);
}

async function getMultipleUser(ids: string[]): Promise<UserInfo[]> {
  return db
    .select(["id", "name", "email", "handler"])
    .from("users")
    .whereIn("id", ids)
    .then(decodeUserInfo);
}

async function checkHandlerExisted(handler: string): Promise<boolean> {
  return db
    .select("handler")
    .from("users")
    .where("handler", "ilike", handler)
    .then((row) => row.length > 0);
}

function toLoginType(loginType: string): LoginType {
  switch (loginType) {
    case "GOOGLE":
      return "GOOGLE";
    case "ACCOUNT":
      return "ACCOUNT";
    default:
      return "UNKNOWN";
  }
}

function decode(data: any[]): Schema[] {
  return JD.array(
    JD.object({
      id: JD.string,
      name: JD.string,
      email: JD.string,
      password: JD.nullable(JD.string),
      createdAt: JD.number,
      handler: JD.string,
      loginType: JD.string.transform((str) => toLoginType(str)),
    })
  ).verify(data);
}

function decodeUserInfo(data: any[]): UserInfo[] {
  return JD.array(
    JD.object({
      id: JD.string,
      name: JD.string,
      email: JD.string,
      handler: JD.string,
    })
  ).verify(data);
}

export {
  Schema,
  UserData,
  LoginType,
  UserInfo,
  insert,
  update,
  checkEmailExisted,
  get,
  getMultipleUser,
  toLoginType,
  checkHandlerExisted,
};
