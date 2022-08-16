import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/auth/Home";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AuthNav() {
  function HomeScreenNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
          //   options={{ title: "Home" }}
        />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
      </Stack.Navigator>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home Screen"
        component={HomeScreenNavigator}
        options={{ tabBarBadge: 5, headerShown: false }}
      />
      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  );
}
