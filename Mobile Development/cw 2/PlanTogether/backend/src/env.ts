import * as JD from "decoders";

type NodeEnv = "development" | "test";
export type Env = Readonly<{
  NODE_ENV: string;
  PORT: number;
}>;

const env: Env = JD.object({
  NODE_ENV: JD.string.transform((str) => isNodeEnv(str)),
  PORT: JD.string.transform((strPort) => isPositiveInt(strPort)),
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
