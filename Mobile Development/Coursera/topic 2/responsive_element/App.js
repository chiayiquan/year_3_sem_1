import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, backgroundColor: "red" }}></View>
      <View style={{ flex: 2, backgroundColor: "yellow" }}></View>
      <View style={{ flex: 3, backgroundColor: "green" }}></View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
});
