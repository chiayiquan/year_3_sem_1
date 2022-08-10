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
  },
});

export const { setUserToState } = userSlice.actions;
export default userSlice.reducer;
