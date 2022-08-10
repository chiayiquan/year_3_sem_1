import * as JD from "decoders";
import type { Error } from "./Error";

export type User = Readonly<{
  id: string;
  name: string;
  email: string;
  createdAt: number;
  jwt: string;
}>;

type ResponseData = Readonly<{
  data: User;
}>;

export function decode(data: any): User | Error {
  try {
    return JD.object({
      id: JD.string,
      name: JD.string,
      email: JD.string,
      createdAt: JD.number,
      jwt: JD.string,
    }).verify(data);
  } catch (error) {
    return {
      code: "DECODER_ERROR",
      message: "Decoding fail check the structure.",
    };
  }
}
