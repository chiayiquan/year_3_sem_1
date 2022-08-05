import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  NativeModuleError,
} from "@react-native-google-signin/google-signin";
import type { User } from "@react-native-google-signin/google-signin";

const config = {
  clientId:
    "522599487334-mvk1efm1lg79rm32k10n6fqatuhmucfq.apps.googleusercontent.com",
  apiKey: "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",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

export default function App() {
  const [userGoogleInfo, setUserGoogleInfo] = useState<User>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "522599487334-mvk1efm1lg79rm32k10n6fqatuhmucfq.apps.googleusercontent.com",
      offlineAccess: true,
    });
    (async () => {
      await GoogleSignin.getCurrentUser();
    })();
  }, []);

  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setLoaded(true);
      setUserGoogleInfo(userInfo);
    } catch (error: any) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <GoogleSigninButton
        onPress={signIn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        style={{ width: 100, height: 100 }}
      />

      {loaded && userGoogleInfo != null ? (
        <View>
          <Text>{userGoogleInfo.user.name}</Text>
        </View>
      ) : (
        <Text>Not Signed In</Text>
      )}
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
