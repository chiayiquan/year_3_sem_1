import { createAction } from "@reduxjs/toolkit";

type JwtPayload = {
  jwt: string;
  dateRange: number[];
};
const getTaskList = createAction<JwtPayload>("getTaskList");

export { getTaskList };
