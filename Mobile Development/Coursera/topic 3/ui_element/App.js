import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Switch,
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      {/* View is the parent component of Text */}
      <View style={styles.ourView}>
        {/* Text is child component of the View, text must always wrap in a Text tag */}
        {/* <Text>Hello!</Text> */}
        {/* <ActivityIndicator size="large" color="black" /> */}
        <Switch
          trackColor={{ false: "purple", true: "blue" }}
          thumbColor="purple"
          value={false}
        />
      </View>
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
  ourView: {
    width: 200,
    height: 200,
    backgroundColor: "lightgray",
  },
});
