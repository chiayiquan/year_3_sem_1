import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Network from "expo-network";
export default function App() {
  const [internetstatus, setInternetstatus] = useState(true);
  const [networkText, setNetworkTest] = useState("");

  useEffect(() => {
    isConnected()
      .then((network) => {
        console.log(`Connection Status - ${network}`);
        if (network != internetstatus) {
          setInternetstatus(network);
        }
      })
      .catch((error) => {
        console.log(`Error occurred = ${error}`);
      });

    if (internetstatus) {
      setNetworkTest("Yesh! There is internet");
    } else {
      setNetworkTest("Nooo! There is no internet");
    }
  });

  return (
    <View style={styles.container}>
      <Text>Status: {networkText}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

function isConnected() {
  return new Promise(async (resolve, reject) => {
    try {
      const networkStatus = await Network.getNetworkStateAsync();
      resolve(networkStatus.isInternetReachable);
    } catch (error) {
      reject(err);
    }
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
