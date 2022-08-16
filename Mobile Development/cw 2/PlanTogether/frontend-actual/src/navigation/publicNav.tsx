import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/public/Login";
import RegisterScreen from "../screens/public/Register";

const Stack = createNativeStackNavigator();

export default function PublicNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Register",
          headerTitleAlign: "center",
          headerBackVisible: true,
          headerBackTitleVisible: true,
        }}
      />
    </Stack.Navigator>
  );
}
