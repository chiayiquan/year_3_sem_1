import * as Task from "../../models/Task";
import { Api } from "../../models/Api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { emptyError, Error } from "../../models/Error";

type UserState = {
  task: Task.StateData;
  promise: {
    get: Api | null;
  };
  error: {
    get: Error;
  };
};

const initialState: UserState = {
  task: {},
  promise: { get: null },
  error: { get: emptyError },
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setInitialState: (state) => {
      return initialState;
    },
    setTaskToState: (state, action: PayloadAction<Task.StateData>) => {
      return { ...state, task: action.payload };
    },
    setTaskGetApiPromise: (state, action: PayloadAction<Api>) => {
      return { ...state, promise: { ...state.promise, get: action.payload } };
    },
    setTaskGetError: (state, action: PayloadAction<Error>) => {
      return { ...state, error: { ...state.error, get: action.payload } };
    },
  },
});

export const {
  setInitialState,
  setTaskToState,
  setTaskGetApiPromise,
  setTaskGetError,
} = taskSlice.actions;
export default taskSlice.reducer;
