import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Button, View } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return { shouldShowAlert: true };
  },
});
export default function App() {
  const [pushToken, setPushToken] = useState();

  useEffect(() => {
    (async () => {
      const permission = await Notifications.getPermissionsAsync();
      if (permission.status !== "granted") {
        const permissionReq = await Notifications.requestPermissionsAsync();
        if (permissionReq !== "granted")
          throw new Error("Permission not granted");
      }

      console.log("Getting token....");
      const tokenResponse = await Notifications.getExpoPushTokenAsync();
      const token = tokenResponse.data;
      setPushToken(token);
      console.log(token);
    })();
  }, []);

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) =>
        console.log(response)
      );

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) =>
        console.log(notification)
      );

    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  });

  const triggerNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        data: { extraData: "Some data in the push notification" },
        title: "This is the title, sent via the app",
        body: "This push notification was sent via the app!",
      }),
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="Send Push Notification"
        onPress={triggerNotificationHandler}
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
