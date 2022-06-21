import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export default function App() {
  const [internetstatus, setInternetstatus] = useState(true);

  const appearanceStatus = NetInfo.addEventListener((state) => {
    console.log("Connection type ", state.type);
    console.log("Connection Status ", state.isConnected);
    setInternetstatus(state.isConnected);
  });

  return (
    <View style={styles.container}>
      <Text>Connection Status</Text>
      <View
        style={{
          marginTop: 20,
          borderRadius: 50,
          width: 50,
          height: 50,
          backgroundColor: internetstatus ? "green" : "red",
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
