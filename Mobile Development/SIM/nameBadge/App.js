import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Emoji from "emoji-dictionary";

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  const name = "YOUR NAME";

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <Text style={styles.welcomeText}>Hello</Text>
        <Text style={styles.subtitleText}>MY NAME IS</Text>
        <View style={styles.innerBox}>
          <Text style={styles.nameText}>
            {name} {Emoji.getUnicode("heart_eyes")}
          </Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  safeAreaContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 90,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 30,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  innerBox: {
    width: "100%",
    height: "55%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 60,
    textAlign: "center",
    fontWeight: "bold",
  },
});
