import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

export default function App() {
  const [rotateValue, setRotateValue] = useState(new Animated.Value(0));

  function startAnimation() {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 400,
        Infinite: true,
      })
    ).start();
  }

  useEffect(() => {
    startAnimation();
  }, []);
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [
            {
              rotate: rotateValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "380deg"],
              }),
            },
          ],
          height: 50,
          width: 50,
          margin: 5,
          borderWidth: 2,
          borderColor: "#888",
          borderBottomColor: "#8bffff",
          borderRadius: 50,
          justifyContent: "center",
        }}
      ></Animated.View>
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
