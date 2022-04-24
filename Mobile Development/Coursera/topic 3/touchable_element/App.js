import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function App() {
  function tapPuppy() {
    alert("You tapped the puppy!");
  }
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/puppies.jpg")}
        style={styles.puppies}
        resizeMode="contain"
      />
      <TouchableOpacity
        onPress={tapPuppy}
        style={styles.faceTap}
      ></TouchableOpacity>
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
  puppies: {
    width: "100%",
    height: "100%",
  },
  faceTap: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: "red",
    position: "absolute",
    left: 110,
    top: 280,
  },
});
