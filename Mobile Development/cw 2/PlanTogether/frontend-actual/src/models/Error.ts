import * as JD from "decoders";
import { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Error = {
  code: string | null;
  message: string | null;
};

export type { Error };

export const emptyError = {
  code: null,
  message: null,
};

// network error
export const networkError = {
  code: "NETWORK_ERROR",
  message: "Backend is not running.",
};

// decoder for errors
export const decode = async (axiosError: AxiosError): Promise<Error> => {
  try {
    const error: Error = JD.object({
      code: JD.string,
      message: JD.string,
    }).verify(axiosError?.response?.data.error);

    if (error.code === "INVALID_SESSION") {
      await AsyncStorage.removeItem("@user");
    }
    return error;
  } catch (error) {
    return {
      code: "DECODER_ERROR",
      message: "Decoding fail check the structure.",
    };
  }
};
