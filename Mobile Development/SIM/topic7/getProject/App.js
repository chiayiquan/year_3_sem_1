import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    //  fetch("https://mocki.io/v1/1e5ab2f6-d8b5-4457-9f88-c0e462be716c")
    fetch(
      "https://darylsrepo.000webhostapp.com/test.php?username=md20062022&name=Daryl Sim"
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
      })
      .catch((err) => {
        console.log(`An error ${err}`);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>This is a Get Request Json Test</Text>
      <Text>{data.name}</Text>
      <Text>{data.message}</Text>
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
