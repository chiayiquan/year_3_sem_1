import createSagaMiddleware from "redux-saga";
import { watcherSaga } from "./rootSaga";
import { configureStore } from "@reduxjs/toolkit";
import devToolsEnhancer from "remote-redux-devtools";
import env from "../env";

import userReducer from "./User";
import taskReducer from "./Task";
import friendReducer from "./Friend";

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: {
    user: userReducer,
    task: taskReducer,
    friend: friendReducer,
  },
  middleware,
  enhancers: [
    devToolsEnhancer({ realtime: true, port: 8000, hostname: env.hostName }),
  ],
});

sagaMiddleware.run(watcherSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
