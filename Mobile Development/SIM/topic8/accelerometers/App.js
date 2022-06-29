import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function App() {
  const [movement, setMovement] = 50;

  useEffect(() => {
    Accelerometer.addListener((item) => {
      setMovement((state) => state * -250);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>x value: {movement}</Text>
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
