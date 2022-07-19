import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import JSONdata from "./test.json";
export default function App() {
  let classString = "CM3035";
  return (
    <View style={styles.container}>
      <Text>Hello {JSONdata.name}</Text>
      <Text>
        {JSONdata.classes[0]}: {JSONdata.grades[classString]}
      </Text>
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
