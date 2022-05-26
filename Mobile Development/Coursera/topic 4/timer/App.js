import { StatusBar } from "expo-status-bar";
import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function App() {
  // setTimeout(() => alert("Hi"), 2000);

  const [colorFlip, setColorFlip] = useState(0);
  const ourInterval = useRef(null);

  function buttonPressed() {
    let buttonState = 0;

    if (ourInterval.current != null) {
      clearInterval(ourInterval.current);
      return (ourInterval.current = null);
    }
    ourInterval.current = setInterval(() => {
      buttonState = buttonState === 0 ? 1 : 0;

      setColorFlip(buttonState);
    }, 3000);
  }

  return (
    <View
      style={[
        styles.container,
        colorFlip ? styles.blueBackground : styles.yellowBackground,
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={buttonPressed}
      ></TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  yellowBackground: {
    backgroundColor: "yellow",
  },
  blueBackground: {
    backgroundColor: "blue",
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "red",
  },
});
