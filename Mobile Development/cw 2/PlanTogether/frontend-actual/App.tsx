import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
// import * as Google from "expo-google-app-auth";
import * as Google from "expo-auth-session/providers/google";

export default function App() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "522599487334-e2a4rgv029bqhelhjou9uc6oq5tvsp1m.apps.googleusercontent.com",
    iosClientId:
      "522599487334-59i8hohktqk2gd87lo1ejlo6ovjd7sb2.apps.googleusercontent.com",
    androidClientId:
      "522599487334-44tl445giq2vu4daqs4f4f2qukknulq2.apps.googleusercontent.com",
    webClientId:
      "522599487334-mvk1efm1lg79rm32k10n6fqatuhmucfq.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log(authentication);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
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
