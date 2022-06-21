import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://api.mocki.io/v2/f3b487a8/conditional", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
      });
  });

  return (
    <View style={styles.container}>
      <Text>{data.message}</Text>
      <Text>{data.secretkey}</Text>
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
