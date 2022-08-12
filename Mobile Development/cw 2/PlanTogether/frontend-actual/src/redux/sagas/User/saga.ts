import { call, put, all } from "redux-saga/effects";
import * as User from "../../../models/User";
import * as UserRedux from "../../modules/user";
import { sagaActions } from "./sagaActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import * as Error from "../../../models/Error";
import * as Api from "../../../models/Api";
import env from "../../../env";

export function* initUser() {
  const user: string | null = yield call(AsyncStorage.getItem, "@user") || null;
  const decodedUser = user == null ? null : User.decode(JSON.parse(user));
  yield put(
    UserRedux.setUserToState(
      decodedUser && "jwt" in decodedUser ? decodedUser : null
    )
  );
}

export function* login(action: typeof sagaActions.LOGIN) {
  try {
    yield all([
      put(UserRedux.setUserGetApiPromise(Api.newApiPromise)),
      put(UserRedux.setUserGetError(Error.emptyError)),
    ]);

    const response: AxiosResponse = yield axios.post(
      `${env.backendUrl}/login`,
      action.payload,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const userData = User.decode(response.data.data);
    yield put(UserRedux.setUserGetApiPromise(Api.resolve200Promise));

    if ("jwt" in userData) {
      yield call(AsyncStorage.setItem, "@user", JSON.stringify(userData));
      yield put(UserRedux.setUserToState(userData));
    } else {
      yield put(UserRedux.setUserGetError(userData));
    }
  } catch (error: any) {
    if (error.response === undefined) {
      yield all([
        put(UserRedux.setUserGetApiPromise(Api.resolve500Promise)),
        put(UserRedux.setUserGetError(Error.networkError)),
      ]);
    } else {
      const errorResponse: Error.Error = yield Error.decode(error);
      yield all([
        put(UserRedux.setUserGetApiPromise(Api.resolve400Promise)),
        put(UserRedux.setUserGetError(errorResponse)),
      ]);
    }
  }
}

export function* register(action: typeof sagaActions.REGISTER) {
  try {
    yield all([
      put(UserRedux.setUserGetApiPromise(Api.newApiPromise)),
      put(UserRedux.setUserGetError(Error.emptyError)),
      axios.post(`${env.backendUrl}/register`, action.payload, {
        headers: {
          Accept: "application/json",
        },
      }),
    ]);

    yield put(UserRedux.setUserGetApiPromise(Api.resolve200Promise));
  } catch (error: any) {
    if (error.response === undefined) {
      yield all([
        put(UserRedux.setUserCreateError(Error.networkError)),
        put(UserRedux.setUserCreateApiPromise(Api.resolve500Promise)),
      ]);
    } else {
      const errorResponse: Error.Error = yield Error.decode(error);
      yield all([
        put(UserRedux.setUserCreateError(errorResponse)),
        put(UserRedux.setUserCreateApiPromise(Api.resolve400Promise)),
      ]);
    }
  }
}
