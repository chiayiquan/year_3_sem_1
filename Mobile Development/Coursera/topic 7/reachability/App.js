import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Network from "expo-network";

export default function App() {
  const [internetConnected, setInternetConnected] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const connected = await isConnected();
        console.log(`Connected status = ${connected}`);
        if (connected != internetConnected) {
          setInternetConnected(connected);
        }
      } catch (error) {
        console.log(`An error occured -> ${error}`);
      }
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text>
        {internetConnected
          ? "ACTIVE internet connection"
          : "No internet connection"}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

async function isConnected() {
  try {
    const networkStatus = await Network.getNetworkStateAsync();
    return networkStatus.isInternetReachable;
  } catch (error) {
    throw error;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
