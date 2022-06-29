import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import Device from "expo-device";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Device.isDevice)
        return setErrorMsg(
          "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
        );

      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted")
        return setErrorMsg("Permission to access location was denied");

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  });

  let text = "Waiting...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
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
  paragraph: {},
});
