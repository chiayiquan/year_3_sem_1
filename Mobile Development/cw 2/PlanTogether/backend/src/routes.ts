import { Express, Response, Request, NextFunction } from "express";

import StandardResponse from "./libs/StandardResponse";
import RegisterApi from "./api/register";
import LoginApi from "./api/login";

type ApiFunction = (
  request: Request,
  response: Response,
  next?: NextFunction
) => Promise<Response>;

function handleError(api: ApiFunction): ApiFunction {
  return async (request, response, next) => {
    return api(request, response, next).catch(async (error) => {
      // we have an uncaught error here
      return StandardResponse.serverFail(request, response, error);
    });
  };
}

export function addRoutesToExpressInstance(app: Express): void {
  app.get("/", (_req, res) => {
    res.json({ data: "Server is up" });
  });

  app.post("/register", handleError(RegisterApi));
  app.post("/login", handleError(LoginApi));
}
