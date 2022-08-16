import * as Session from "./model";
import { generateID } from "../../db";
import moment from "moment";

async function createSession(
  userId: string,
  authToken: string | null
): Promise<Session.Schema | null> {
  const session: Session.Schema = {
    id: generateID(),
    userId,
    createdAt: moment().unix(),
    authToken,
  };
  return Session.insert(session)
    .then(() => session)
    .catch(() => null);
}

async function checkSessionExist(sessionData: {
  id: string;
  userId: string;
}): Promise<Session.Schema> {
  return Session.get(sessionData);
}

async function deleteSession(userId: string, id: string) {
  return Session.remove(userId, id);
}

export default {
  createSession,
  checkSessionExist,
  deleteSession,
};
