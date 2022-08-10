import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import { StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as UserRedux from "./redux/sagas/User";

export default function App() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(
        "@user",
        JSON.stringify({
          id: "sodjkosajdpjsa",
          name: "abc",
          email: "abc@example.com",
          createdAt: 141115311,
          jwt: "jwt",
        })
      );
    })();
    dispatch({ type: UserRedux.sagaActions.FETCH_INIT_USER_SAGA });
  }, []);

  return (
    <View>
      <Text>{user.user && user.user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
