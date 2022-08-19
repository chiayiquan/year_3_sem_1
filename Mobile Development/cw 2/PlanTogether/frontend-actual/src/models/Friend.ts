import * as JD from "decoders";
import { Error } from "./Error";

type Status = "accepted" | "pending" | "declined";

type Friend = Readonly<{
  id: string;
  from: string;
  to: string;
  status: Status;
  requestedDate: number;
  readNotification: boolean;
}>;

function decodeApiResponse(data: any[]): Friend[] | Error {
  try {
    return JD.array(
      JD.object({
        id: JD.string,
        from: JD.string,
        to: JD.string,
        status: JD.string.transform(toStatus),
        requestedDate: JD.number,
        readNotification: JD.boolean,
      })
    ).verify(data);
  } catch (error) {
    return {
      code: "DECODER_ERROR",
      message: "Decoding fail check the structure.",
    };
  }
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

export { Friend, Status, decodeApiResponse };
