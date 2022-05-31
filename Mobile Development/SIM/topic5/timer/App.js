import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  // Timeout
  // const timeout = setTimeout(() => timeoutId, 2000);

  // const timeoutId = setTimeout(() => alert("Affter two seconds"), 2000);

  // setInterval
  const intervalID = setInterval(intervalId, 3000);

  const intervalId = setInterval(() => alert("Every three second"), 3000);

  clearInterval(intervalID);
  clearInterval(intervalId);

  //setImmediate
  // const immediateID = setImmediate(immediateId);

  // display alert dialogue immediately
  // const immediateId = setImmediate(() => alert("Immediate Alert"));

  // clearImmediate(immediateID);
  // clearImmediate(immediateId);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
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
