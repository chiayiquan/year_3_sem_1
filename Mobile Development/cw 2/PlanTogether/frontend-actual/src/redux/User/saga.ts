import { call, put, all } from "redux-saga/effects";
import * as User from "../../models/User";
import * as UserRedux from "./reducer";
import { sagaActions } from "./sagaActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";
import * as Error from "../../models/Error";
import * as Api from "../../models/Api";
import env from "../../env";

export function* initUser() {
  const user: string | null = yield call(AsyncStorage.getItem, "@user") || null;

  const decodedUser = user == null ? null : User.decode(JSON.parse(user));
  yield all([
    put(
      UserRedux.setUserToState(
        decodedUser && "jwt" in decodedUser ? decodedUser : null
      )
    ),
    put(UserRedux.setInitialLoadingState(false)),
  ]);
}

export function* login({ payload }: typeof sagaActions.LOGIN) {
  try {
    yield all([
      put(UserRedux.setUserGetApiPromise(Api.newApiPromise)),
      put(UserRedux.setUserGetError(Error.emptyError)),
    ]);

    const response: AxiosResponse = yield axios.post(
      `${env.backendUrl}/login`,
      { ...payload, loginType: "ACCOUNT" },
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

export function* loginWithGoogle({
  payload,
}: typeof sagaActions.LOGIN_WITH_GOOGLE) {
  try {
    yield all([
      put(UserRedux.setGoogleUserApiPromise(Api.newApiPromise)),
      put(UserRedux.setGoogleUserError(Error.emptyError)),
    ]);

    const response: AxiosResponse = yield axios.post(
      `${env.backendUrl}/login`,
      {
        email: null,
        password: null,
        authToken: String(payload.authToken),
        loginType: "GOOGLE",
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    yield put(UserRedux.setGoogleUserApiPromise(Api.resolve200Promise));

    if ("jwt" in response.data.data) {
      const userData = User.decode(response.data.data);

      if ("jwt" in userData) {
        yield call(AsyncStorage.setItem, "@user", JSON.stringify(userData));
        yield put(UserRedux.setUserToState(userData));
      } else {
        yield put(UserRedux.setGoogleUserError(userData));
      }
    } else {
      const userData = User.decodeGoogleRegisterForm(response.data.data);

      if ("authToken" in userData) {
        // remove all the previous state
        yield put(UserRedux.setInitialState());
        // set googleData to state
        yield put(UserRedux.setGoogleUserData(userData));
      } else {
        yield put(UserRedux.setGoogleUserError(userData));
      }
    }
  } catch (error: any) {
    if (error.response === undefined) {
      yield all([
        put(UserRedux.setGoogleUserApiPromise(Api.resolve500Promise)),
        put(UserRedux.setGoogleUserError(Error.networkError)),
      ]);
    } else {
      const errorResponse: Error.Error = yield Error.decode(error);
      yield all([
        put(UserRedux.setGoogleUserApiPromise(Api.resolve400Promise)),
        put(UserRedux.setGoogleUserError(errorResponse)),
      ]);
    }
  }
}

export function* register({ payload }: typeof sagaActions.REGISTER) {
  try {
    yield all([
      put(UserRedux.setUserGetApiPromise(Api.newApiPromise)),
      put(UserRedux.setUserGetError(Error.emptyError)),
      axios.post(
        `${env.backendUrl}/register`,
        { ...payload, loginType: "ACCOUNT" },
        {
          headers: {
            Accept: "application/json",
          },
        }
      ),
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

export function* registerWithGoogle({
  payload,
}: typeof sagaActions.REGISTER_WITH_GOOGLE) {
  try {
    yield all([
      put(UserRedux.setUserGetApiPromise(Api.newApiPromise)),
      put(UserRedux.setUserGetError(Error.emptyError)),
      axios.post(
        `${env.backendUrl}/register`,
        {
          email: payload.email,
          name: payload.name,
          password: null,
          handler: payload.handler,
          loginType: "GOOGLE",
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      ),
    ]);

    yield put(UserRedux.setInitialState());

    yield* loginWithGoogle({
      payload: { authToken: payload.authToken },
      type: sagaActions.LOGIN_WITH_GOOGLE.type,
    });
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
