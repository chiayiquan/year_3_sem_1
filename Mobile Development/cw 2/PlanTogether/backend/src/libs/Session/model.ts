import db from "../../db";
import * as JD from "decoders";

type Schema = Readonly<{
  id: string;
  userId: string;
  createdAt: number;
}>;

async function insert(data: Schema) {
  return db.into("sessions").insert(data);
}

async function get(whereClause: Partial<Schema>) {
  return db
    .select()
    .from("sessions")
    .where(whereClause)
    .then((rows) => decode(rows)[0]);
}

async function remove(userId: string, id: string) {
  return db.table("sessions").where({ id, userId }).delete();
}

function decode(data: any[]): Schema[] {
  return JD.array(
    JD.object({
      id: JD.string,
      userId: JD.string,
      createdAt: JD.number,
    })
  ).verify(data);
}

export { Schema, insert, get, remove };
