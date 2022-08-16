import express from "express";
import StandardReponse from "../libs/StandardResponse";
import User from "../libs/User";

type ResponseData = {
  data: boolean;
};

export default async function Handler(
  request: express.Request,
  response: express.Response
) {
  const existed = await User.checkHandlerExist(request.params.handler);

  return StandardReponse.success<ResponseData>(response, {
    data: existed,
  });
}
