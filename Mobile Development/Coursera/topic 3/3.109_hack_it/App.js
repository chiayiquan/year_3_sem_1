import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function App() {
  const [switched, setSwitch] = useState(false);
  function pressedButton() {
    setSwitch((state) => !state);
  }
  return (
    <View
      style={[
        styles.container,
        switched == true ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <TouchableOpacity
        style={styles.lightswitch}
        onPress={pressedButton}
      ></TouchableOpacity>
      <Text
        style={[
          styles.subtitle,
          switched ? styles.darkSubtitle : styles.lightSubtitle,
        ]}
      >
        {switched == true
          ? "It's dark!"
          : "Toggle the lights with the switch above"}
      </Text>
      <StatusBar style={switched == true ? "light" : "dark"} />
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
  lightswitch: {
    width: 70,
    height: 130,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    borderWidth: 1,
    borderColor: "gray",
  },
  subtitle: {
    marginTop: 30,
    fontWeight: "bold",
  },
  darkContainer: {
    backgroundColor: "#242424",
  },
  lightContainer: {
    backgroundColor: "white",
  },
  lightSubtitle: {
    color: "black",
  },
  darkSubtitle: {
    color: "yellow",
  },
});
