import * as JD from "decoders";
import db from "../../db";
import * as User from "../User";

type TaskSchema = Readonly<{
  id: string;
  name: string;
  datetimeStart: number; // store as epoch
  datetimeEnd: number;
  location: string | null;
  description: string | null;
  status: TaskStatus;
  createdBy: string;
  createdAt: number; // store as epoch
}>;

type ParticipantSchema = Readonly<{
  id: string;
  taskId: string;
  userId: string;
  status: ParticipantStatus;
  readNotification: boolean;
}>;

type TaskData = Readonly<{
  task: TaskSchema;
  participants: {
    id: string;
    taskId: string;
    user: User.UserInfo;
    status: ParticipantStatus;
    readNotification: boolean;
  }[];
}>;

type TaskStatus = "pending" | "confirmed";

type ParticipantStatus = "pending" | "declined" | "accepted";

function getTaskByDateRange(
  taskIds: string[],
  dateRange: number[]
): Promise<TaskSchema[]> {
  return db
    .select("*")
    .from("tasks")
    .whereIn("id", taskIds)
    .andWhereBetween("datetimeStart", [dateRange[0], dateRange[1]])
    .orWhereIn("id", taskIds)
    .andWhereBetween("datetimeEnd", [dateRange[0], dateRange[1]])
    .then((data) => decodeTask(data));
}

async function getUserTaskList(userId: string): Promise<ParticipantSchema[]> {
  return db
    .select("*")
    .from("participants")
    .where({ userId })
    .then(decodeParticipant);
}

async function getParticipants(taskId: string[]): Promise<ParticipantSchema[]> {
  return db
    .select("*")
    .from("participants")
    .whereIn("taskId", taskId)
    .then(decodeParticipant);
}

function decodeTask(data: any[]): TaskSchema[] {
  return JD.array(
    JD.object({
      id: JD.string,
      name: JD.string,
      datetimeStart: JD.number,
      datetimeEnd: JD.number,
      location: JD.nullable(JD.string),
      description: JD.nullable(JD.string),
      status: JD.string.transform(transformToTaskStatus),
      createdBy: JD.string,
      createdAt: JD.number,
    })
  ).verify(data);
}

function decodeParticipant(data: any[]): ParticipantSchema[] {
  return JD.array(
    JD.object({
      id: JD.string,
      taskId: JD.string,
      userId: JD.string,
      status: JD.string.transform(transformToParticipantStatus),
      readNotification: JD.boolean,
    })
  ).verify(data);
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

export {
  TaskSchema,
  ParticipantSchema,
  TaskStatus,
  ParticipantStatus,
  getTaskByDateRange,
  getParticipants,
  getUserTaskList,
  TaskData,
};
