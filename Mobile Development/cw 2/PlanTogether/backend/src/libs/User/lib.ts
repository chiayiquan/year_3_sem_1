import * as User from "./model";
import { generateID } from "../../db";
import bcrypt from "bcrypt"; // we use bcrypt here to hash our password, it is a one way meaning with the hash you cannot reverse it to the plaintext

async function createUser(params: {
  name: string;
  email: string;
  password: string;
}): Promise<User.Schema | null> {
  const userData: User.Schema = {
    ...params,
    id: generateID(),
    createdAt: Date.now(),
    email: params.email.trim().toLowerCase(),
  };
  return User.insert(userData)
    .then(() => userData)
    .catch(() => null);
}

async function checkEmailExist(email: string): Promise<boolean> {
  return User.checkEmail(email.trim().toLowerCase());
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

async function getUserByEmail(email: string): Promise<User.Schema> {
  return User.get({ email: email.trim().toLowerCase() });
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
  };
}

async function getMultiple(ids: string[]): Promise<User.Schema[]> {
  return User.getMultiple(ids);
}

export default {
  createUser,
  checkEmailExist,
  hashPassword,
  comparePassword,
  getUserByEmail,
  getUserById,
  transformToUserData,
  getMultiple,
};
