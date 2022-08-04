import express from "express";
import StandardReponse from "../libs/StandardResponse";
import * as JD from "decoders";
import User from "../libs/User";
import Regex from "../libs/Regex";

type Params = {
  name: string;
  email: string;
  password: string;
};

export const errors = {
  EMAIL_EXIST: "Email is already being used.",
  DB_ERROR: "Unable to insert data.",
  EMAIL_ERROR: "Unable to send email.",
  INVALID_EMAIL: "Email is invalid.",
};

type ResponseData = {
  data: string;
};

export default async function Register(
  request: express.Request,
  response: express.Response
) {
  const params = await transformData(decodeParams(request.body));

  if (!Regex.checkValidEmail(params.email))
    return StandardReponse.fail(response, errors, "INVALID_EMAIL");

  if ((await User.checkEmailExist(params.email)) === false)
    return StandardReponse.fail(response, errors, "EMAIL_EXIST");

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
    password: JD.string,
  }).verify(data);
}

async function transformData(params: Params): Promise<Params> {
  return {
    ...params,
    email: params.email,
    password: await User.hashPassword(params.password),
  };
}
