import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import exampleJson from "./example.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [input, setInput] = useState("");

  const userId = "600";
  const { name, age, subject } = exampleJson;

  const saveUserId = async (value) => {
    try {
      await AsyncStorage.setItem("@userId", userId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserId = async () => {
    try {
      const userId = (await AsyncStorage.getItem("@userId")) || null;
      setInput(userId);
    } catch (error) {
      console.log(error.message);
    }
  };

  saveUserId(userId);
  getUserId();

  return (
    <View style={styles.container}>
      <Text>Name: {name}</Text>
      <Text>Age: {age}</Text>
      {subject.map(({ name, grade }) => (
        <View key={name}>
          <Text>Subject: {name}</Text>
          <Text>Grade: {grade}</Text>
        </View>
      ))}

      <Text>User ID: {input}</Text>
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
