import jwt from "jsonwebtoken";
import env from "../../env";
import * as JD from "decoders";
import Session from "../Session";
import express from "express";

const { JWT_SECRET } = env;

type Payload = Readonly<{
  sessionId: string;
  userId: string;
}>;

function decodePayload(data: any): Payload {
  return JD.object({
    sessionId: JD.string,
    userId: JD.string,
  }).verify(data);
}

const errors = {
  UNEXPECTED_ERROR: "Unexpected error occurs.",
  INVALID_SESSION: "Invalid Session.",
};

class JWTError extends Error {
  name: keyof typeof errors;
  constructor(code: keyof typeof errors) {
    super(errors[code]);
    this.name = code;
  }
}

async function issue(sessionId: string, userId: string): Promise<string> {
  return jwt.sign({ userId, sessionId }, JWT_SECRET);
}

async function getJWTToken(
  expressRequest: express.Request
): Promise<Payload | JWTError> {
  const authorization = String(expressRequest.header("Authorization"));
  const matches = authorization.match(/Bearer (.*)/);
  const token = matches == null ? "" : matches[1];
  return verify(token);
}

async function verify(token: string): Promise<Payload | JWTError> {
  const verifyResult = verifyToken(token);
  if (verifyResult instanceof JWTError) return verifyResult;
  const isExisting = await Session.checkSessionExist({
    id: verifyResult.sessionId,
    userId: verifyResult.userId,
  });
  return isExisting ? verifyResult : new JWTError("INVALID_SESSION");
}

function verifyToken(token: string): Payload | JWTError {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return decodePayload(payload);
  } catch (error) {
    return new JWTError("UNEXPECTED_ERROR");
  }
}

export { Payload, errors, JWTError, issue, getJWTToken };
