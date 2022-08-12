import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as UserRedux from "../redux/sagas/User";

import AuthNav from "./authNav";
import PublicNav from "./publicNav";

export default function Navigator() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      // await AsyncStorage.setItem(
      //   "@user",
      //   JSON.stringify({
      //     id: "sodjkosajdpjsa",
      //     name: "abc",
      //     email: "abc@example.com",
      //     createdAt: 141115311,
      //     jwt: "jwt",
      //   })
      // );
      await AsyncStorage.removeItem("@user");
    })();
    dispatch({ type: UserRedux.sagaActions.FETCH_INIT_USER_SAGA });
  }, []);

  return (
    <NavigationContainer>
      {user.user != null ? <AuthNav /> : <PublicNav />}
    </NavigationContainer>
  );
}
