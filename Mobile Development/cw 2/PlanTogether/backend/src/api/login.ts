import express from "express";
import StandardReponse from "../libs/StandardResponse";
import * as JD from "decoders";
import User, { UserData, LoginType, toLoginType } from "../libs/User";
import Session from "../libs/session";
import JWT from "../libs/JWT";

type Params = {
  email: string;
  password: string | null;
  loginType: LoginType;
  authToken: string | null;
};

export const errors = {
  INVALID_ACCOUNT: "Invalid account.",
  SESSION_ERROR: "Fail to create session.",
};

type CreateAccountResponseData = {
  data: string;
  code: string;
};

type ResponseData = {
  data: UserData;
};

export default async function Register(
  request: express.Request,
  response: express.Response
) {
  const params = decodeParams(request.body);

  const userData = await User.getUserByEmail(params.email);

  if (params.loginType === "ACCOUNT") {
    if (userData == null) {
      return StandardReponse.fail(response, errors, "INVALID_ACCOUNT");
    }

    if (params.password == null || userData.password == null)
      return StandardReponse.fail(response, errors, "INVALID_ACCOUNT");

    const isPasswordMatched = await User.comparePassword(
      params.password,
      userData.password
    );

    if (isPasswordMatched === false) {
      return StandardReponse.fail(response, errors, "INVALID_ACCOUNT");
    }
  } else {
    if (userData == null) {
      return StandardReponse.success<CreateAccountResponseData>(response, {
        code: "CREATE_ACCOUNT",
        data: "Account not found.",
      });
    }
  }

  const session = await Session.createSession(userData.id, params.authToken);

  if (session == null) {
    return StandardReponse.fail(response, errors, "SESSION_ERROR");
  }
  const jwt = await JWT.issue(session.id, session.userId);

  const responseData = User.transformToUserData(userData, jwt);
  return StandardReponse.success<ResponseData>(response, {
    data: responseData,
  });
}

function decodeParams(data: any): Params {
  return JD.object({
    email: JD.string,
    password: JD.nullable(JD.string),
    loginType: JD.string.transform(toLoginType),
    authToken: JD.nullable(JD.string),
  }).verify(data);
}
