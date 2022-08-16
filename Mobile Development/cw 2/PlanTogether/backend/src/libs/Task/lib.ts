import * as Task from "./model";
import User from "../User";

async function getUserTaskListByDateRange(
  userId: string,
  dateRange: number[]
): Promise<Task.TaskData[]> {
  const taskList = await Task.getUserTaskList(userId);
  const taskIds = taskList.map(({ taskId }) => taskId);
  const taskDetails = await Task.getTaskByDateRange(taskIds, dateRange);
  const participants = await Task.getParticipants(taskIds);
  const uniqueUser = [...new Set(participants.map(({ userId }) => userId))];
  const users = await User.getMultipleUserInfo(uniqueUser);

  return taskDetails.reduce(
    (accumulator: Task.TaskData[], currentValue: Task.TaskSchema) => {
      accumulator.push({
        task: currentValue,
        participants: participants
          .filter(({ taskId }) => taskId === currentValue.id)
          .map(({ id, taskId, userId, status }) => {
            return {
              id,
              taskId,
              status,
              user: users.filter(({ id }) => userId === id)[0],
            };
          }),
      });
      return accumulator;
    },
    []
  );
}

export default { getUserTaskListByDateRange };
