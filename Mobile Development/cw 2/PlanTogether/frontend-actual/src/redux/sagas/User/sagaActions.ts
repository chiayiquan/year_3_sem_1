import { string } from "decoders";

export const sagaActions = {
  FETCH_INIT_USER_SAGA: "FETCH_INIT_USER_SAGA",
  LOGIN: {
    type: "LOGIN",
    payload: { email: string, password: string },
  },
  REGISTER: {
    type: "REGISTER",
    payload: { email: string, password: string, name: string },
  },
};
