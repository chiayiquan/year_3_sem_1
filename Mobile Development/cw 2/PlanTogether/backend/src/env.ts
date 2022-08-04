import * as JD from "decoders";

type NodeEnv = "development" | "test";
export type Env = Readonly<{
  NODE_ENV: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
}>;

const env: Env = JD.object({
  NODE_ENV: JD.string.transform((str) => isNodeEnv(str)),
  PORT: JD.string.transform((strPort) => isPositiveInt(strPort)),
  DB_HOST: JD.string,
  DB_PORT: JD.string.transform((strPort) => isPositiveInt(strPort)),
  DB_USER: JD.string,
  DB_PASSWORD: JD.string,
  DB_NAME: JD.string,
  JWT_SECRET: JD.string,
}).verify(process.env);

function isPositiveInt(value: string): number {
  const num = parseInt(value);
  if (isNaN(num) || num < 0) throw new Error("Must be a positive integer.");
  return num;
}

function isNodeEnv(env: string): NodeEnv {
  switch (env) {
    case "development":
      return "development";
    case "test":
      return "test";
    default:
      throw new Error("Invalid environment");
  }
}

export default env;
