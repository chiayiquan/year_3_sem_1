import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, EventEmitter } from "react-native";
// import * as Google from "expo-google-app-auth";
import * as Google from "expo-auth-session/providers/google";
import type { TokenResponse } from "expo-auth-session/";

export default function App() {
  const [user, setUser] = useState<TokenResponse>();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
    iosClientId:
      "522599487334-59i8hohktqk2gd87lo1ejlo6ovjd7sb2.apps.googleusercontent.com",
    androidClientId:
      "522599487334-44tl445giq2vu4daqs4f4f2qukknulq2.apps.googleusercontent.com",
    webClientId:
      "522599487334-mvk1efm1lg79rm32k10n6fqatuhmucfq.apps.googleusercontent.com",
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication) setUser(authentication);
      console.log(authentication);
    }
  }, [response]);

  async function getCalendarList() {
    if (user != null) {
      try {
        let calendarsList = await fetch(
          "https://www.googleapis.com/calendar/v3/users/me/calendarList",
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        console.log(calendarsList);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Button disabled={!request} title="Login" onPress={() => promptAsync()} />
      <Button title="Get List" onPress={() => getCalendarList()} />
      <StatusBar style="auto" />
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
