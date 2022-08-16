import * as Friend from "./model";

async function getFriends(userId: string): Promise<Friend.Schema[]> {
  return Friend.get(userId);
}

export default { getFriends };
