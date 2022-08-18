import * as JD from "decoders";
import {
  DEV_BACKEND_URL,
  EXPO_CLIENT_ID,
  IOS_CLIENT_ID,
  ANDROID_CLIENT_ID,
  HOST_NAME,
} from "@env";

export type Env = Readonly<{
  hostName: string;
  backendUrl: string;
  expoClientId: string;
  iosClientId: string;
  androidClientId: string;
}>;

const devEnv: Env = {
  hostName: HOST_NAME,
  backendUrl: DEV_BACKEND_URL,
  expoClientId: EXPO_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  androidClientId: ANDROID_CLIENT_ID,
};

const prodEnv: Env = {
  hostName: HOST_NAME,
  backendUrl: DEV_BACKEND_URL,
  expoClientId: EXPO_CLIENT_ID,
  iosClientId: IOS_CLIENT_ID,
  androidClientId: ANDROID_CLIENT_ID,
};
export default __DEV__ ? devEnv : prodEnv;
