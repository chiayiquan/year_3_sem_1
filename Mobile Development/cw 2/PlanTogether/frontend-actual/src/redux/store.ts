import createSagaMiddleware from "redux-saga";
import { watcherSaga } from "./sagas/rootSaga";
import { configureStore } from "@reduxjs/toolkit";
import devToolsEnhancer from "remote-redux-devtools";

import userReducer from "./modules/user";

const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware,
  enhancers: [
    devToolsEnhancer({ realtime: true, port: 8000, hostname: "192.168.1.10" }),
  ],
});

sagaMiddleware.run(watcherSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
