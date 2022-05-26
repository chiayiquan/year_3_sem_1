import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";

export default function App() {
  const [pickedState, setPickedState] = useState(-1);

  useEffect(() => {
    Alert.alert("What colour should the text be?", "Pick and option", [
      { text: "Red", onPress: () => setPickedState(0) },
      { text: "Blue", onPress: () => setPickedState(1) },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <Text
        style={
          pickedState === -1
            ? null
            : pickedState
            ? styles.blueText
            : styles.redText
        }
      >
        Open up App.js to start working on your app!
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
  redText: {
    color: "red",
  },
  blueText: {
    color: "blue",
  },
});
