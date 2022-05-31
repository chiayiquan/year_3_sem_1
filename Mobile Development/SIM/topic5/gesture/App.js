import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  useWindowDimensions,
  PanResponder,
} from "react-native";

const cursorSize = 30;
const cursorHalfSize = cursorSize / 2;

export default function App() {
  const touch = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const windowDimension = useWindowDimensions();

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={() => true}
      onResponderMove={(event) =>
        touch.setValue({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        })
      }
      onResponderRelease={() => {
        Animated.spring(touch, {
          toValue: {
            x: windowDimension.height / 2 - cursorHalfSize,
            y: windowDimension.width / 2 - cursorHalfSize,
          },
          useNativeDriver: true,
        }).start();
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: Animated.subtract(touch.x, cursorHalfSize),
          left: Animated.subtract(touch.y, cursorHalfSize),
          height: cursorSize,
          width: cursorSize,
          borderRadius: cursorHalfSize,
          backgroundColor: "blue",
        }}
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
});
