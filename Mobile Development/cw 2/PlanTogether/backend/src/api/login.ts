import express from "express";
import StandardReponse from "../libs/StandardResponse";
import * as JD from "decoders";
import User, {
  UserData,
  LoginType,
  toLoginType,
  Schema as UserSchema,
} from "../libs/User";
import Session from "../libs/session";
import JWT from "../libs/JWT";
import env from "../env";
import Google from "../libs/Google";

type Params = {
  email: string | null;
  password: string | null;
  loginType: LoginType;
  authToken: string | null;
};

export const errors = {
  INVALID_ACCOUNT: "Invalid account.",
  SESSION_ERROR: "Fail to create session.",
  GOOGLE_SESSION_EXPIRED: "Google session has expired please relogin.",
};

type CreateAccountResponseData = {
  data: {
    email: string;
    name: string;
    authToken: string;
  };
};

type ResponseData = {
  data: UserData;
};

export default async function Register(
  request: express.Request,
  response: express.Response
) {
  const params = decodeParams(request.body);
  let userData = null;

  if (params.loginType === "ACCOUNT") {
    if (params.email == null)
      return StandardReponse.fail(response, errors, "INVALID_ACCOUNT");

    const user = await User.getUserByEmail(params.email, params.loginType);
    const checkPasswordError = await checkAccountPassword(
      user,
      params.password
    );

    if (checkPasswordError != null)
      return StandardReponse.fail(response, errors, checkPasswordError);

    userData = user;
  } else {
    // test env not possible to get valid google auth code so bypass the check
    if (env.NODE_ENV === "test") {
      if (params.email != null) {
        userData = await User.getUserByEmail(params.email, params.loginType);
      }
    } else {
      if (params.authToken == null)
        return StandardReponse.fail(response, errors, "GOOGLE_SESSION_EXPIRED");
      const authData = await Google.getAuthData(params.authToken);

      if (authData == null)
        return StandardReponse.fail(response, errors, "GOOGLE_SESSION_EXPIRED");

      if (authData.expires_in < 1)
        return StandardReponse.fail(response, errors, "GOOGLE_SESSION_EXPIRED");

      const user = await User.getUserByEmail(authData.email, params.loginType);
      console.log(`user ${user}`);
      if (user == null) {
        const googleUserData = await Google.getUserData(params.authToken);
        if (googleUserData == null)
          return StandardReponse.fail(
            response,
            errors,
            "GOOGLE_SESSION_EXPIRED"
          );
        // prompt user to register an account with google retrieved information
        return StandardReponse.success<CreateAccountResponseData>(response, {
          data: {
            email: googleUserData.email,
            name: googleUserData.name,
            authToken: params.authToken,
          },
        });
      }

      userData = user;
    }
  }

  if (userData == null)
    return StandardReponse.fail(response, errors, "INVALID_ACCOUNT");

  const session = await Session.createSession(userData.id, params.authToken);
  console.log(session);
  if (session == null) {
    return StandardReponse.fail(response, errors, "SESSION_ERROR");
  }
  const jwt = await JWT.issue(session.id, session.userId);

  const responseData = User.transformToUserData(userData, jwt);
  return StandardReponse.success<ResponseData>(response, {
    data: responseData,
  });
}

async function checkAccountPassword(
  userData: UserSchema,
  password: string | null
): Promise<null | keyof typeof errors> {
  if (userData == null) {
    return "INVALID_ACCOUNT";
  }

  if (password == null || userData.password == null) return "INVALID_ACCOUNT";

  const isPasswordMatched = await User.comparePassword(
    password,
    userData.password
  );

  if (isPasswordMatched === false) {
    return "INVALID_ACCOUNT";
  }

  return null;
}

function decodeParams(data: any): Params {
  return JD.object({
    email: JD.nullable(JD.string),
    password: JD.nullable(JD.string),
    loginType: JD.string.transform(toLoginType),
    authToken: JD.nullable(JD.string),
  }).verify(data);
}
