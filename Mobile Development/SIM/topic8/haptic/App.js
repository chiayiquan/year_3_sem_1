import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

export default function App() {
  function impactAsync(style) {
    switch (style) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => impactAsync("light")}>
        <Text style={styles.light}>Light</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => impactAsync("medium")}>
        <Text style={styles.medium}>Medium</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => impactAsync("heavy")}>
        <Text style={styles.heavy}>Heavy</Text>
      </TouchableOpacity>
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
  light: {
    color: "#ffffff",
    fontSize: 20,
    width: 300,
    height: 100,
    backgroundColor: "green",
    marginVertical: 10,
  },
  medium: {
    color: "#ffffff",
    fontSize: 20,
    width: 300,
    height: 100,
    backgroundColor: "orange",
    marginVertical: 10,
  },
  heavy: {
    color: "#ffffff",
    fontSize: 20,
    width: 300,
    height: 100,
    backgroundColor: "red",
    marginVertical: 10,
  },
});
