import * as User from "../../models/User";
import { Api } from "../../models/Api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyError, Error } from "../../models/Error";

type UserState = {
  user: User.User | null;
  promise: {
    create: Api | null;
    get: Api | null;
  };
  error: {
    create: Error;
    get: Error;
  };
};

const initialState: UserState = {
  user: null,
  promise: { create: null, get: null },
  error: { create: emptyError, get: emptyError },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserToState: (state, action: PayloadAction<User.User | null>) => {
      return { ...state, user: action.payload };
    },
    setUserGetApiPromise: (state, action: PayloadAction<Api>) => {
      return { ...state, promise: { ...state.promise, get: action.payload } };
    },
    setUserGetError: (state, action: PayloadAction<Error>) => {
      return { ...state, error: { ...state.error, get: action.payload } };
    },
    setUserCreateApiPromise: (state, action: PayloadAction<Api>) => {
      return {
        ...state,
        promise: { ...state.promise, create: action.payload },
      };
    },
    setUserCreateError: (state, action: PayloadAction<Error>) => {
      return { ...state, error: { ...state.error, create: action.payload } };
    },
  },
});

export const {
  setUserToState,
  setUserGetApiPromise,
  setUserGetError,
  setUserCreateApiPromise,
  setUserCreateError,
} = userSlice.actions;
export default userSlice.reducer;
