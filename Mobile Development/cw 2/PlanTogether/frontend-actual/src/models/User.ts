import * as JD from "decoders";
import type { Error } from "./Error";

export type User = Readonly<{
  id: string;
  name: string;
  email: string;
  createdAt: number;
  jwt: string;
  handler: string;
}>;

export type GoogleRegisterForm = Readonly<{
  email: string;
  name: string;
  authToken: string;
}>;

export type UserInfo = Readonly<{
  id: string;
  name: string;
  email: string;
  handler: string;
}>;

export function decode(data: any): User | Error {
  try {
    return JD.object({
      id: JD.string,
      name: JD.string,
      email: JD.string,
      createdAt: JD.number,
      jwt: JD.string,
      handler: JD.string,
    }).verify(data);
  } catch (error) {
    return {
      code: "DECODER_ERROR",
      message: "Decoding fail check the structure.",
    };
  }
}

export function decodeGoogleRegisterForm(
  data: any
): GoogleRegisterForm | Error {
  try {
    console.log(
      JD.object({
        email: JD.string,
        authToken: JD.string,
        name: JD.string,
      }).verify(data)
    );
    return JD.object({
      email: JD.string,
      authToken: JD.string,
      name: JD.string,
    }).verify(data);
  } catch (error) {
    return {
      code: "DECODER_ERROR",
      message: "Decoding fail check the structure.",
    };
  }
}
