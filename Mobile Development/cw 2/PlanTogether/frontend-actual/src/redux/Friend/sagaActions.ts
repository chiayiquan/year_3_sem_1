import { createAction } from "@reduxjs/toolkit";

type GetPayload = {
  jwt: string;
};
const getFriendList = createAction<GetPayload>("getFriendList");

export { getFriendList };
