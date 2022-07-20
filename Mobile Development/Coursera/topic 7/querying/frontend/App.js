import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import base64 from "react-native-base64";

export default function App() {
  async function reqSend() {
    console.log("Sending request");
    try {
      const response = await fetch("http://192.168.1.10:3000/test", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${base64.encode("username:password")}`,
        },
        body: JSON.stringify({
          param1: "testing....",
        }),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(`There was an error -> ${error}`);
    }
  }
  return (
    <View style={styles.container}>
      <Button title="Start request" onPress={reqSend} />
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
