import * as User from "./User";
import * as JD from "decoders";
import { Error } from "./Error";

export type ParticipantStatus = "pending" | "declined" | "accepted";
export type TaskStatus = "pending" | "confirmed";

export type Task = Readonly<{
  id: string;
  name: string;
  datetime: number; // stored as epoch
  location: string | null;
  description: string | null;
  status: TaskStatus;
  createdBy: string;
  createdAt: number; // stored as epoch
}>;

export type Participants = Readonly<{
  id: string;
  taskId: string;
  user: User.UserInfo;
  status: ParticipantStatus;
}>;

export type ApiData = Readonly<{
  task: Task;
  participants: Participants[];
}>;

export type StateData = {
  [date: string]: StateDataEntry[];
};

export type StateDataEntry = {
  task: {
    id: string;
    name: string;
    time: string;
    location: string | null;
    description: string | null;
    status: TaskStatus;
    createdBy: string;
    createdAt: string;
  };
  participants: Participants[];
};

export function decodeApiResponse(data: any): ApiData[] | Error {
  try {
    return JD.array(
      JD.object({
        task: JD.object({
          id: JD.string,
          name: JD.string,
          datetime: JD.number,
          location: JD.nullable(JD.string),
          description: JD.nullable(JD.string),
          status: JD.string.transform(transformToTaskStatus),
          createdBy: JD.string,
          createdAt: JD.number,
        }),
        participants: JD.array(
          JD.object({
            id: JD.string,
            taskId: JD.string,
            user: JD.object({
              id: JD.string,
              name: JD.string,
              email: JD.string,
              handler: JD.string,
            }),
            status: JD.string.transform(transformToParticipantStatus),
          })
        ),
      })
    ).verify(data);
  } catch (error) {
    return {
      code: "DECODER_ERROR",
      message: "Decoding fail check the structure.",
    };
  }
}

export function decodeStateDataEntry(data: any): StateDataEntry | Error {
  try {
    return JD.object({
      task: JD.object({
        id: JD.string,
        name: JD.string,
        time: JD.string,
        location: JD.nullable(JD.string),
        description: JD.nullable(JD.string),
        status: JD.string.transform(transformToTaskStatus),
        createdBy: JD.string,
        createdAt: JD.string,
      }),
      participants: JD.array(
        JD.object({
          id: JD.string,
          taskId: JD.string,
          user: JD.object({
            id: JD.string,
            name: JD.string,
            email: JD.string,
            handler: JD.string,
          }),
          status: JD.string.transform(transformToParticipantStatus),
        })
      ),
    }).verify(data);
  } catch (error) {
    return {
      code: "DECODER_ERROR",
      message: "Decoding fail check the structure.",
    };
  }
}

function transformToParticipantStatus(status: string): ParticipantStatus {
  switch (status) {
    case "pending":
      return "pending";
    case "declined":
      return "declined";
    default:
      return "accepted";
  }
}

function transformToTaskStatus(status: string): TaskStatus {
  switch (status) {
    case "pending":
      return "pending";
    default:
      return "confirmed";
  }
}
