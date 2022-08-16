import express from "express";
import StandardReponse from "../libs/StandardResponse";
import * as JD from "decoders";
import User, { toLoginType, LoginType } from "../libs/User";
import Regex from "../libs/Regex";

type Params = {
  name: string;
  email: string;
  password: string | null;
  handler: string;
  loginType: LoginType;
};

export const errors = {
  EMAIL_EXIST: "Email is already being used.",
  DB_ERROR: "Unable to insert data.",
  EMAIL_ERROR: "Unable to send email.",
  INVALID_EMAIL: "Email is invalid.",
  HANDLER_EXIST: "Handler is already being used.",
  INVALID_LOGIN_TYPE: "Does not support this login type.",
  EMPTY_NAME: "Name cannot be empty.",
  EMPTY_HANDLER: "Handler cannot be empty.",
};

type ResponseData = {
  data: string;
};

export default async function Register(
  request: express.Request,
  response: express.Response
) {
  const params = await transformData(decodeParams(request.body));

  if (params.name.length < 1)
    return StandardReponse.fail(response, errors, "EMPTY_NAME");

  if (params.handler.length < 1)
    return StandardReponse.fail(response, errors, "EMPTY_HANDLER");

  if (!Regex.checkValidEmail(params.email))
    return StandardReponse.fail(response, errors, "INVALID_EMAIL");

  if (await User.checkEmailExist(params.email, params.loginType))
    return StandardReponse.fail(response, errors, "EMAIL_EXIST");

  if (await User.checkHandlerExist(params.handler))
    return StandardReponse.fail(response, errors, "HANDLER_EXIST");

  if (params.loginType === "UNKNOWN")
    return StandardReponse.fail(response, errors, "INVALID_LOGIN_TYPE");

  const userData = await User.createUser(params);
  if (userData == null) {
    return StandardReponse.fail(response, errors, "DB_ERROR");
  }

  return StandardReponse.success<ResponseData>(response, {
    data: "User created",
  });
}

function decodeParams(data: any): Params {
  return JD.object({
    name: JD.string,
    email: JD.string,
    password: JD.nullable(JD.string),
    handler: JD.string,
    loginType: JD.string.transform(toLoginType),
  }).verify(data);
}

async function transformData(params: Params): Promise<Params> {
  return {
    ...params,
    password:
      params.password != null
        ? await User.hashPassword(params.password)
        : params.password,
  };
}
