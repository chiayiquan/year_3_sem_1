import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [ready, setReady] = useState(false);
  const [slideInLeft, setSlideInLeft] = useState(new Animated.Value(0));
  const [slideUpValue, setSlideUpValue] = useState(new Animated.Value(0));
  const [fadeValue, setFadeValue] = useState(new Animated.Value(0));

  function startAnimation() {
    return Animated.parallel([
      Animated.timing(slideInLeft, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={startAnimation}>
        <Text style={styles.textBtn}>Start</Text>
      </TouchableOpacity>

      <Animated.View
        style={{
          transform: [
            {
              translateX: slideInLeft.interpolate({
                inputRange: [0, 1],
                outputRange: [-600, 0],
              }),
            },
          ],
          flex: 1,
          height: 250,
          width: 200,
          borderRadius: 12,
          backgroundColor: "#c00",
          justifyContent: "center",
        }}
      >
        <Text style={styles.text}>SlideInLeft</Text>
      </Animated.View>

      <Animated.View
        style={{
          transform: [
            {
              translateY: slideUpValue.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0],
              }),
            },
          ],
          flex: 1,
          height: 250,
          width: 200,
          borderRadius: 12,
          backgroundColor: "#347a2a",
          justifyContent: "center",
        }}
      >
        <Text style={styles.text}>SlideUp</Text>
      </Animated.View>

      <Animated.View
        style={{
          opacity: fadeValue,
          flex: 1,
          height: 250,
          width: 200,
          borderRadius: 12,
          backgroundColor: "#f4f",
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
  btn: {
    backgroundColor: "#480032",
    width: 100,
    height: 40,
    padding: 3,
    justifyContent: "center",
    borderRadius: 6,
    marginTop: 29,
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  textBtn: {
    color: "#f4f4f4",
    fontWeight: "bold",
    textAlign: "center",
  },
});
