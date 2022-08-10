import * as JD from "decoders";
import { AxiosError } from "axios";

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
export const decode = (axiosError: AxiosError): Error => {
  try {
    const error: Error = JD.object({
      code: JD.string,
      message: JD.string,
    }).verify(axiosError);

    if (error.code === "INVALID_SESSION") {
      localStorage.removeItem("user");
    }
    return error;
  } catch (error) {
    return {
      code: "DECODER_ERROR",
      message: "Decoding fail check the structure.",
    };
  }
};
