import { StatusBar } from "expo-status-bar";
import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Touchable,
} from "react-native";

export default function App() {
  const textOpacity = useRef(new Animated.Value(0)).current;
  const aniX = useRef(new Animated.Value(0)).current;
  const aniY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [textOpacity]);

  const AnimatedText = (props) => {
    return (
      <Animated.Text style={{ ...props.style, opacity: textOpacity }}>
        {props.children}
      </Animated.Text>
    );
  };

  const shift = () => {
    Animated.parallel([
      Animated.spring(aniX, {
        toValue: Math.random() * (100 - -100) + -100,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.spring(aniY, {
        toValue: Math.random() * (100 - -100) + -100,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={shift}>
        <Animated.View
          style={[styles.shyButton, { marginLeft: aniX, marginTop: aniY }]}
        >
          <Text
            style={{ fontSize: 16, fontWeight: "500", alignSelf: "center" }}
          >
            Don't press
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
    // <View style={styles.container}>
    //   <AnimatedText style={{ color: "red", fontSize: 100 }}>TEST!</AnimatedText>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  shyButton: {
    padding: 20,
    backgroundColor: "red",
    borderRadius: 10,
    width: 150,
    height: 60,
  },
});
