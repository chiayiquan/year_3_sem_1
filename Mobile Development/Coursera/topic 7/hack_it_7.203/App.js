import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default function App() {
  const [info, setInfo] = useState(null);

  async function makeCall() {
    const response = await fetch(
      "https://archive.org/metadata/principleofrelat00eins"
    );
    const data = await response.json();
    return setInfo(data);
  }
  return (
    <View style={styles.container}>
      {info == null ? (
        <Button title="Make call" onPress={makeCall} />
      ) : (
        <>
          <Text>{info.metadata.title}</Text>
          <Text>
            {info.metadata.subject}-{info.metadata.date}
          </Text>
          <Text></Text>
          {info.metadata.creator.map((creator) => (
            <Text>{creator}</Text>
          ))}
        </>
      )}

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
