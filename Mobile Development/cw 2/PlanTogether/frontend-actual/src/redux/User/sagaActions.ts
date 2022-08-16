import { string, boolean } from "decoders";

export const sagaActions = {
  FETCH_INIT_USER_SAGA: "FETCH_INIT_USER_SAGA",
  LOGIN: {
    type: "LOGIN",
    payload: {
      email: string,
      password: string,
      authToken: string,
    },
  },
  LOGIN_WITH_GOOGLE: {
    type: "LOGIN_WITH_GOOGLE",
    payload: {
      authToken: string,
    },
  },
  REGISTER: {
    type: "REGISTER",
    payload: {
      email: string,
      password: string,
      name: string,
      handler: string,
    },
  },
  REGISTER_WITH_GOOGLE: {
    type: "REGISTER_WITH_GOOGLE",
    payload: {
      email: string,
      name: string,
      handler: string,
      authToken: string,
    },
  },
};
