import * as User from "../../models/User";
import { Api } from "../../models/Api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyError, Error } from "../../models/Error";

type UserState = {
  user: User.User | null;
  promise: {
    create: Api | null;
    get: Api | null;
    google: Api | null;
  };
  error: {
    create: Error;
    get: Error;
    google: Error;
  };
  registerGoogleData: User.GoogleRegisterForm | null;
  initialLoading: boolean;
};

const initialState: UserState = {
  user: null,
  promise: { create: null, get: null, google: null },
  error: { create: emptyError, get: emptyError, google: emptyError },
  registerGoogleData: null,
  initialLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInitialState: (state) => {
      return initialState;
    },
    setUserToState: (state, action: PayloadAction<User.User | null>) => {
      return { ...state, user: action.payload };
    },
    setInitialLoadingState: (state, action: PayloadAction<boolean>) => {
      return { ...state, initialLoading: action.payload };
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

    setGoogleUserData: (
      state,
      action: PayloadAction<User.GoogleRegisterForm>
    ) => {
      return { ...state, registerGoogleData: action.payload };
    },
    setGoogleUserApiPromise: (state, action: PayloadAction<Api>) => {
      return {
        ...state,
        promise: { ...state.promise, google: action.payload },
      };
    },
    setGoogleUserError: (state, action: PayloadAction<Error>) => {
      return { ...state, error: { ...state.error, google: action.payload } };
    },
  },
});

export const {
  setUserToState,
  setUserGetApiPromise,
  setUserGetError,
  setUserCreateApiPromise,
  setUserCreateError,
  setInitialState,
  setGoogleUserData,
  setGoogleUserApiPromise,
  setGoogleUserError,
  setInitialLoadingState,
} = userSlice.actions;
export default userSlice.reducer;
