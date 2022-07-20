import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  const [internetConnected, setInternetConnected] = useState(true);

  const unsubscribe = NetInfo.addEventListener((state) => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
    console.log(state);
    if (internetConnected !== state.isConnected)
      setInternetConnected(state.isConnected);
  });

  return (
    <View style={styles.container}>
      <Text>
        {internetConnected ? "Internet connected" : "Internet not connected"}
      </Text>
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
