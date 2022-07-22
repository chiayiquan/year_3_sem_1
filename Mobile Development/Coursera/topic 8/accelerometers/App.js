import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Accelerometer } from "expo-sensors";

export default function App() {
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
  };

  useEffect(() => {
    _subscribe();

    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.ball,
          {
            top: scale(data.y, -1, 1, 0, Dimensions.get("window").height),
            right: scale(data.x, -1, 1, 0, Dimensions.get("window").width),
          },
        ]}
      ></View>
      <StatusBar style="auto" />
    </View>
  );
}

function scale(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  ball: {
    width: 50,
    height: 50,
    backgroundColor: "blue",
    position: "absolute",
    borderRadius: 25,
  },
});
