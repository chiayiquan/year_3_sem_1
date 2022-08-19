import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Calendar from "../screens/auth/Calendar";
import { Ionicons } from "@expo/vector-icons";

// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function AuthNav() {
  // function HomeScreenNavigator() {
  //   return (
  //     <Stack.Navigator>
  //       <Stack.Screen
  //         name="HomeScreen"
  //         component={HomeScreen}
  //         options={{ headerShown: false }}
  //         //   options={{ title: "Home" }}
  //       />
  //       {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
  //     </Stack.Navigator>
  //   );
  // }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Tasks") {
            return (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={size}
                color={color}
              />
            );
          } else if (route.name === "Settings") {
            return (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={size}
                color={color}
              />
            );
          } else {
            return (
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarInactiveTintColor: "gray",
        tabBarActiveTintColor: "tomato",
      })}
    >
      <Tab.Screen
        name="Tasks"
        component={Calendar}
        options={{ tabBarBadge: 5, headerShown: false }}
      />

      <Tab.Screen
        name="Friends"
        component={Calendar}
        options={{ tabBarBadge: 5, headerShown: false }}
      />
      <Tab.Screen
        name="Settings"
        component={Calendar}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
