import * as User from "./model";
import { generateID } from "../../db";
import bcrypt from "bcrypt"; // we use bcrypt here to hash our password, it is a one way meaning with the hash you cannot reverse it to the plaintext
import moment from "moment";

async function createUser(params: {
  name: string;
  email: string;
  password: string | null;
  handler: string;
  loginType: User.LoginType;
}): Promise<User.Schema | null> {
  const userData: User.Schema = {
    ...params,
    id: generateID(),
    createdAt: moment().unix(),
    email: params.email.trim().toLowerCase(),
  };
  return User.insert(userData)
    .then(() => userData)
    .catch(() => null);
}

async function checkEmailExist(
  email: string,
  loginType: User.LoginType
): Promise<boolean> {
  return User.checkEmailExisted(email.trim().toLowerCase(), loginType);
}

async function checkHandlerExist(handler: string): Promise<boolean> {
  return User.checkHandlerExisted(handler.trim());
}

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 11);
}

async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

async function getUserByEmail(
  email: string,
  loginType: User.LoginType
): Promise<User.Schema> {
  return User.get({ email: email.trim().toLowerCase(), loginType });
}

async function getUserById(id: string): Promise<User.Schema> {
  return User.get({ id });
}

function transformToUserData(
  userData: User.Schema,
  jwt: string
): User.UserData {
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    createdAt: userData.createdAt,
    jwt,
    handler: userData.handler,
  };
}

async function getMultipleUserInfo(ids: string[]): Promise<User.UserInfo[]> {
  return User.getMultipleUser(ids);
}

export default {
  createUser,
  checkEmailExist,
  hashPassword,
  comparePassword,
  getUserByEmail,
  getUserById,
  transformToUserData,
  getMultipleUserInfo,
  checkHandlerExist,
};
