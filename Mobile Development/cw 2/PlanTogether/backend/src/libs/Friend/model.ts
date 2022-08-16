import db from "../../db";
import * as JD from "decoders";

type Status = "accepted" | "pending" | "declined";

type Schema = Readonly<{
  id: string;
  from: string;
  to: string;
  status: Status;
  requestedDate: number;
}>;

async function get(userId: string): Promise<Schema[]> {
  return db
    .select()
    .from("friends")
    .where({ from: userId })
    .orWhere({ to: userId })
    .then((rows) => decode(rows));
}

function decode(data: any[]): Schema[] {
  return JD.array(
    JD.object({
      id: JD.string,
      from: JD.string,
      to: JD.string,
      status: JD.string.transform(toStatus),
      requestedDate: JD.number,
    })
  ).verify(data);
}

function toStatus(loginType: string): Status {
  switch (loginType) {
    case "accepted":
      return "accepted";
    case "declined":
      return "declined";
    default:
      return "pending";
  }
}

export { get, Schema, Status };
