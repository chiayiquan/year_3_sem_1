import * as Friend from "../../models/Friend";
import { Api } from "../../models/Api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyError, Error } from "../../models/Error";

type FriendState = {
  friend: Friend.Friend[];
  promise: {
    get: Api | null;
  };
  error: {
    get: Error;
  };
};

const initialState: FriendState = {
  friend: [],
  promise: { get: null },
  error: { get: emptyError },
};

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {
    setInitialState: (state) => {
      return initialState;
    },
    setFriendToState: (state, action: PayloadAction<Friend.Friend[]>) => {
      return { ...state, friend: action.payload };
    },
    setFriendGetApiPromise: (state, action: PayloadAction<Api>) => {
      return { ...state, promise: { ...state.promise, get: action.payload } };
    },
    setFriendGetError: (state, action: PayloadAction<Error>) => {
      return { ...state, error: { ...state.error, get: action.payload } };
    },
  },
});

export const {
  setInitialState,
  setFriendToState,
  setFriendGetApiPromise,
  setFriendGetError,
} = friendSlice.actions;
export default friendSlice.reducer;
