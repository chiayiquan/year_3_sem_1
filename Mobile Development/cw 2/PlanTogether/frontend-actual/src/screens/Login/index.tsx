import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, EventEmitter } from "react-native";
// import * as Google from "expo-google-app-auth";
import * as Google from "expo-auth-session/providers/google";
import { Prompt, TokenResponse, refreshAsync } from "expo-auth-session";

export default function App() {
  const [user, setUser] = useState<TokenResponse>();
  const [code, setCode] = useState<string | null>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
    iosClientId:
      "522599487334-59i8hohktqk2gd87lo1ejlo6ovjd7sb2.apps.googleusercontent.com",
    androidClientId:
      "522599487334-9717m9cb0lbtoi43hj77qtu3vogtk68p.apps.googleusercontent.com",
    // webClientId:
    //   "522599487334-mvk1efm1lg79rm32k10n6fqatuhmucfq.apps.googleusercontent.com",
    scopes: [
      "openid",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    responseType: "code",
    shouldAutoExchangeCode: false,
    extraParams: {
      access_type: "offline",
    },
    prompt: Prompt.Consent,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication, params } = response;
      setCode(params.code);
      console.log(response);
      if (authentication) {
        setUser(authentication);
        (async () => {
          const getUserReq = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
              headers: {
                Authorization: `Bearer ${authentication.accessToken}`,
              },
            }
          );
          console.log(await getUserReq.json());
        })();
      }
    }
  }, [response]);

  async function getCalendarList() {
    try {
      // if (code != null) {
      //   try {
      //     const tokenResult = await refreshAsync(
      //       {
      //         clientId:
      //           "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
      //         refreshToken: code,
      //       },
      //       {
      //         tokenEndpoint: "www.googleapis.com/oauth2/v4/token",
      //       }
      //     );
      //     console.log(tokenResult);
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
      console.log(code);
      const data = await fetch("https://accounts.google.com/o/oauth2/token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          client_id:
            "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
          client_secret: "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",
          redirect_uri: "https://auth.expo.io/@xieyiquan/frontend-actual",
          grant_type: "authorization_code",
          code_challenge_method: "S256",

          scopes: [
            "openid",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
          ],
        }),
      });
      // const data = await fetch(
      //   `https://accounts.google.com/o/oauth2/token?grant_type=authorization_code&code=${code}&client_id=522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com&client_secret=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&redirect_uri=https://auth.expo.io/@xieyiquan/frontend-actual`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //     // body: JSON.stringify({
      //     //   code: code,
      //     //   client_id:
      //     //     "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
      //     //   client_secret: "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",
      //     //   redirect_uri: "https://auth.expo.io/@xieyiquan/frontend-actual",
      //     //   grant_type: "authorization_code",
      //     // }),
      //   }
      // );
      console.log(await data.json());
    } catch (error) {
      console.log(error);
    }

    if (user != null) {
      try {
        let calendarsList = await fetch(
          "https://www.googleapis.com/calendar/v3/users/me/calendarList",
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
              Accept: "application/json",
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
