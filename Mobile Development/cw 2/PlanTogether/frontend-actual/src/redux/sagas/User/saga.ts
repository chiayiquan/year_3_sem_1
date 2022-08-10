import { call, put } from "redux-saga/effects";
import * as User from "../../../models/User";
import { setUserToState } from "../../modules/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function* initUser() {
  const user: string | null = yield call(AsyncStorage.getItem, "@user") || null;
  const decodedUser = user == null ? null : User.decode(JSON.parse(user));
  yield put(
    setUserToState(decodedUser && "jwt" in decodedUser ? decodedUser : null)
  );
}
