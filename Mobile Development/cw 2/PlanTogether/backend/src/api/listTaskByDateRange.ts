import express from "express";
import StandardReponse from "../libs/StandardResponse";
import Task, { TaskData } from "../libs/Task";
import JWT from "../libs/JWT";
import * as JD from "decoders";

type Params = {
  dateRange: number[];
};

export const errors = {
  ...JWT.errors,
  INVALID_DATE_RANGE: "Date range is invalid.",
};

type ResponseData = {
  data: TaskData[];
};

export default async function ListTaskByDateRange(
  request: express.Request,
  response: express.Response
) {
  const jwtResult = await JWT.getJWTToken(request);

  if (jwtResult instanceof JWT.JWTError) {
    return StandardReponse.fail(response, errors, jwtResult.name);
  }

  const params = decodeParams(request.params.dateRange.split(","));

  if (params.dateRange.length !== 2)
    return StandardReponse.fail(response, errors, "INVALID_DATE_RANGE");

  const taskList = await Task.getUserTaskListByDateRange(
    jwtResult.userId,
    params.dateRange
  );

  return StandardReponse.success<ResponseData>(response, { data: taskList });
}

function decodeParams(data: any): Params {
  return {
    dateRange: JD.array(JD.string.transform((str) => parseInt(str))).verify(
      data
    ),
  };
}
