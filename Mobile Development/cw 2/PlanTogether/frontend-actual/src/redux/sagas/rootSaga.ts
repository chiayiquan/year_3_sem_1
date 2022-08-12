import { string } from "decoders";
import { takeLatest } from "redux-saga/effects";
import * as UserSaga from "./User";

export function* watcherSaga() {
  yield takeLatest(
    UserSaga.sagaActions.FETCH_INIT_USER_SAGA,
    UserSaga.initUser
  );
  yield takeLatest(UserSaga.sagaActions.LOGIN.type, UserSaga.login);
  yield takeLatest(UserSaga.sagaActions.REGISTER.type, UserSaga.register);
}
