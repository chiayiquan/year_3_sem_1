import express from "express";

function success<T>(
  expressResponse: express.Response,
  data: T
): express.Response {
  return expressResponse.status(200).json(data);
}

function fail<T>(
  expressResponse: express.Response,
  errors: T,
  errorCode: keyof T
): express.Response {
  return expressResponse.status(400).json({
    error: { code: errorCode, message: errors[errorCode] },
  });
}

function serverFail(
  _expressRequest: express.Request,
  expressResponse: express.Response,
  _error: Error
): express.Response {
  return expressResponse.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An internal server error occurred.",
    },
  });
}
export default {
  success,
  fail,
  serverFail,
};
