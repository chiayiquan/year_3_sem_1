import express from "express";
import StandardReponse from "../libs/StandardResponse";
import JWT from "../libs/JWT";
import User, { UserInfo } from "../libs/User";
import FriendLib, { Status as FriendStatus } from "../libs/Friend";

export const errors = {
  ...JWT.errors,
  INVALID_DATE_RANGE: "Date range is invalid.",
};

type ResponseData = {
  data: {
    id: string;
    from:
      | string
      | Readonly<{
          id: string;
          name: string;
          email: string;
          handler: string;
        }>;
    to:
      | string
      | Readonly<{
          id: string;
          name: string;
          email: string;
          handler: string;
        }>;
    status: FriendStatus;
    requestedDate: number;
  }[];
};

export default async function ListTaskByDateRange(
  request: express.Request,
  response: express.Response
) {
  const jwtResult = await JWT.getJWTToken(request);

  if (jwtResult instanceof JWT.JWTError) {
    return StandardReponse.fail(response, errors, jwtResult.name);
  }
  console.log(jwtResult.userId);
  const friendsRecord = await FriendLib.getFriends(jwtResult.userId);

  const friends = friendsRecord.map(({ to, from }) =>
    to === jwtResult.userId ? from : to
  );

  const friendData = await User.getMultipleUserInfo(friends);

  const transformedData = friendsRecord.map((friend) => ({
    id: friend.id,
    from:
      friend.from === jwtResult.userId
        ? jwtResult.userId
        : mapToFriendData(friend.from, friendData),
    to:
      friend.to === jwtResult.userId
        ? jwtResult.userId
        : mapToFriendData(friend.to, friendData),
    status: friend.status,
    requestedDate: friend.requestedDate,
  }));

  return StandardReponse.success<ResponseData>(response, {
    data: transformedData,
  });
}

function mapToFriendData(friendId: string, friendData: UserInfo[]): UserInfo {
  return friendData.filter(({ id }) => id === friendId)[0];
}
