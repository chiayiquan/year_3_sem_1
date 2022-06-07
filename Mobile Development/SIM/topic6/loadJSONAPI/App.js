import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";

export default function App() {
  const [responseData, setResponseData] = useState({});
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/adhithiravi/React-Hooks-Examples/master/testAPI.json"
    )
      .then((response) => response.json())
      .then((data) => setResponseData(data))
      .catch((error) => console.log(error));
    // .finally(() => setIsLoading(false));
  }, []);
  console.log(responseData);
  
  return (
    <View style={styles.container}>
      <Text>{responseData.title}</Text>
      <FlatList
        data={responseData.articles}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => {
          <Text>{item.title}</Text>;
        }}
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
