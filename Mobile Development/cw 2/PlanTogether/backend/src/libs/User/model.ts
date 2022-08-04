import db from "../../db";
import * as JD from "decoders";

type Schema = Readonly<{
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number; // timestamp is stored as posix(number) because different timezone won't affect it
}>;

type UserData = Readonly<{
  id: string;
  name: string;
  email: string;
  createdAt: number;
  jwt: string;
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

async function checkEmail(email: string): Promise<boolean> {
  return db
    .select("email")
    .from("users")
    .where({ email })
    .then((row) => row.length === 0);
}

async function get(whereClause: Partial<Schema>): Promise<Schema> {
  return db
    .select()
    .from("users")
    .where(whereClause)
    .then((rows) => decode(rows)[0]);
}

async function getMultiple(ids: string[]): Promise<Schema[]> {
  return db.select().from("users").whereIn("id", ids).then(decode);
}

function decode(data: any[]): Schema[] {
  return JD.array(
    JD.object({
      id: JD.string,
      name: JD.string,
      email: JD.string,
      password: JD.string,
      createdAt: JD.number,
    })
  ).verify(data);
}

export { Schema, UserData, insert, update, checkEmail, get, getMultiple };
