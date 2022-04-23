import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      {/* inline styling */}
      {/* <View
        style={{ width: 200, height: 200, backgroundColor: "lightblue" }}
      ></View> */}

      <View style={[styles.blueSquare, { marginBottom: 20 }]}>
        <Text style={styles.buttonText}>Button 1</Text>
      </View>
      <View style={[styles.blueSquare, styles.disableSquare]}>
        <Text style={styles.buttonText}>Button 2</Text>
      </View>
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
  blueSquare: {
    backgroundColor: "lightgreen",
    borderColor: "blue",
    borderWidth: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  disableSquare: {
    backgroundColor: "lightgray",
    borderColor: "gray",
  },
  buttonText: {
    fontSize: 50,
    fontWeight: "bold",
  },
});
