import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [text, onChangeText] = useState("");

  useEffect(() => {
    (async () => {
      const result = await AsyncStorage.getItem("@textInput");
      onChangeText(result);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={async (text) => {
          await AsyncStorage.setItem("@textInput", text);
          onChangeText(text);
        }}
        value={text}
        placeholder={"Value"}
      />
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
