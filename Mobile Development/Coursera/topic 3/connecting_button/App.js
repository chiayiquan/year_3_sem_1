import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

export default function App() {
  function pressedButton(name) {
    console.log(`Hello ${name}`);
  }

  return (
    <View style={styles.container}>
      <Button title="Press me!" onPress={() => pressedButton("mate")} />
      {/* OR */}
      <Button title="Press me!" onPress={() => console.log("Hello mate!")} />
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
