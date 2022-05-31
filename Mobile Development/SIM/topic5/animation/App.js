import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated, Easing } from "react-native";

export default function App() {
  // Animation using javascript
  // const [translation, setTranslation] = useState(0);

  // useEffect(() => {
  //   [...new Array(50).keys()].forEach((key) =>
  //     setTimeout(() => setTranslation(key), 25 * key)
  //   );
  // }, []);

  // Animation using Animated api
  // const translation = useRef(new Animated.Value(0)).current;
  const translation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    // [...new Array(50).keys()].forEach((key) =>
    //   setTimeout(() => translation.setValue(key), 25 * key)
    // );

    // Timing
    // Animated.timing(translation, {
    //   toValue: 100,
    //   easing: Easing.bounce,
    //   delay: 3000,
    //   duration: 3000,
    //   useNativeDriver: true,
    // }).start();

    // Spring
    // Animated.spring(translation, {
    //   toValue: 100,
    //   easing: Easing.bounce,
    //   delay: 3000,
    //   bounciness: 50,
    //   speed: 100,
    //   useNativeDriver: true,
    // }).start();

    // Sequence
    // Animated.sequence([
    //   Animated.spring(translation.x, {
    //     toValue: -150,
    //     useNativeDriver: true,
    //   }),
    //   Animated.spring(translation.y, {
    //     toValue: -150,
    //     useNativeDriver: true,
    //   }),
    // ]).start();

    // Parallel
    Animated.parallel([
      Animated.spring(translation.x, {
        toValue: -150,
        useNativeDriver: true,
      }),
      Animated.spring(translation.y, {
        toValue: -150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Animated.View
        style={[styles.square, { transform: [{ translateY: translation }] }]}
      ></Animated.View> */}
      <Animated.View
        style={[
          styles.square,
          {
            transform: [
              { translateX: translation.x },
              { translateY: translation.y },
            ],
          },
        ]}
      ></Animated.View>
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
  square: {
    width: 200,
    height: 200,
    backgroundColor: "blue",
  },
});
