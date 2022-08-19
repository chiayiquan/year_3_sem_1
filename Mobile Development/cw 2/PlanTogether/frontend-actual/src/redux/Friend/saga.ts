import { put, all } from "redux-saga/effects";
import * as Friend from "../../models/Friend";
import * as FriendReducer from "./reducer";
import * as sagaActions from "./sagaActions";
import axios, { AxiosResponse } from "axios";
import * as Error from "../../models/Error";
import * as Api from "../../models/Api";
import env from "../../env";

export function* getFriendList({
  payload,
}: ReturnType<typeof sagaActions.getFriendList>) {
  try {
    yield all([
      put(FriendReducer.setFriendGetApiPromise(Api.newApiPromise)),
      put(FriendReducer.setFriendGetError(Error.emptyError)),
    ]);

    const response: AxiosResponse = yield axios.get(
      `${env.backendUrl}/list-friends`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${payload.jwt}`,
        },
      }
    );

    const friendData = Friend.decodeApiResponse(response.data.data);
    yield put(FriendReducer.setFriendGetApiPromise(Api.resolve200Promise));

    if ("code" in friendData) {
      yield put(FriendReducer.setFriendGetError(friendData));
    } else {
      yield put(FriendReducer.setFriendToState(friendData));
    }
  } catch (error: any) {
    if (error.response === undefined) {
      yield all([
        put(FriendReducer.setFriendGetApiPromise(Api.resolve500Promise)),
        put(FriendReducer.setFriendGetError(Error.networkError)),
      ]);
    } else {
      const errorResponse: Error.Error = yield Error.decode(error);
      yield all([
        put(FriendReducer.setFriendGetApiPromise(Api.resolve400Promise)),
        put(FriendReducer.setFriendGetError(errorResponse)),
      ]);
    }
  }
}
