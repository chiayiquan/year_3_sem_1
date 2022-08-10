import createSagaMiddleware from "redux-saga";
import { watcherSaga } from "./sagas/rootSaga";
import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./modules/user";

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware,
});

sagaMiddleware.run(watcherSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
