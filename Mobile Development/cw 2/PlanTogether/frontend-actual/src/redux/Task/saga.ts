import { call, put, all } from "redux-saga/effects";
import * as Task from "../../models/Task";
import * as TaskReducer from "./reducer";
import * as sagaActions from "./sagaActions";
import axios, { AxiosResponse } from "axios";
import * as Error from "../../models/Error";
import * as Api from "../../models/Api";
import env from "../../env";
import DateLib from "../../utils/date";

export function* getTask({
  payload,
}: ReturnType<typeof sagaActions.getTaskList>) {
  try {
    yield all([
      put(TaskReducer.setTaskGetApiPromise(Api.newApiPromise)),
      put(TaskReducer.setTaskGetError(Error.emptyError)),
    ]);

    const response: AxiosResponse = yield axios.get(
      `${env.backendUrl}/get-user-task/${payload.dateRange}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${payload.jwt}`,
        },
      }
    );

    const taskData = Task.decodeApiResponse(response.data.data);
    yield put(TaskReducer.setTaskGetApiPromise(Api.resolve200Promise));

    if ("code" in taskData) {
      yield put(TaskReducer.setTaskGetError(taskData));
    } else {
      const formattedTaskData = taskData.reduce(
        (accumulator: Task.StateData, currentValue: Task.ApiData) => {
          const { datetime, createdAt, ...rest } = currentValue.task;
          const [date, time]: string[] =
            DateLib.convertUnixToDate(datetime).split(" ");

          if (!accumulator[date]) {
            accumulator[date] = [];
          }

          accumulator[date].push({
            task: {
              ...rest,
              time,
              createdAt: DateLib.convertUnixToDate(createdAt),
            },
            participants: currentValue.participants,
          });
          return accumulator;
        },
        {}
      );
      yield put(TaskReducer.setTaskToState(formattedTaskData));
    }
  } catch (error: any) {
    if (error.response === undefined) {
      yield all([
        put(TaskReducer.setTaskGetApiPromise(Api.resolve500Promise)),
        put(TaskReducer.setTaskGetError(Error.networkError)),
      ]);
    } else {
      const errorResponse: Error.Error = yield Error.decode(error);
      yield all([
        put(TaskReducer.setTaskGetApiPromise(Api.resolve400Promise)),
        put(TaskReducer.setTaskGetError(errorResponse)),
      ]);
    }
  }
}
