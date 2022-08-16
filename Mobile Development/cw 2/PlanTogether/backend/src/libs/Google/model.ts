import * as JD from "decoders";

export type GoogleUserData = Readonly<{
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
}>;

export type GoogleAuthTokenData = Readonly<{
  issued_to: string;
  audience: string;
  user_id: string;
  scope: string;
  expires_in: number;
  email: string;
  verified_email: boolean;
  access_type: string;
}>;

export function decodeGoogleUserData(data: any): GoogleUserData {
  return JD.object({
    email: JD.string,
    family_name: JD.string,
    given_name: JD.string,
    id: JD.string,
    locale: JD.string,
    name: JD.string,
    picture: JD.string,
    verified_email: JD.boolean,
  }).verify(data);
}

export function decodeGoogleAuthTokenData(data: any): GoogleAuthTokenData {
  return JD.object({
    issued_to: JD.string,
    audience: JD.string,
    user_id: JD.string,
    scope: JD.string,
    expires_in: JD.number,
    email: JD.string,
    verified_email: JD.boolean,
    access_type: JD.string,
  }).verify(data);
}
