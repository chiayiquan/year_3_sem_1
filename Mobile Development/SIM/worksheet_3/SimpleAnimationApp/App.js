import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [fadeValue, setFadeValue] = useState(new Animated.Value(0));

  function startAnimation() {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 1000,
    }).start();
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={startAnimation}>
        <Text style={styles.textBtn}>Start</Text>
      </TouchableOpacity>

      <Animated.View
        style={{
          opacity: fadeValue,
          height: 250,
          width: 200,
          margin: 5,
          borderRadius: 12,
          backgroundColor: "red",
          justifyContent: "center",
        }}
      >
        <Text style={styles.text}>Fade</Text>
      </Animated.View>
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
  item: {},
  btn: {
    backgroundColor: "#480032",
    width: 100,
    height: 40,
    padding: 3,
    justifyContent: "center",
    borderRadius: 6,
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  item1: {
    backgroundColor: "red",
    padding: 20,
    width: 100,
    margin: 10,
  },
  textBtn: {
    color: "#f4f4f4",
    fontWeight: "bold",
    textAlign: "center",
  },
});
