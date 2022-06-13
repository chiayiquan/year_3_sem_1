import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

  return (
    <SafeAreaView style={{ flex: 1, width: "100%", height: "100%" }}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>hello</Text>
        <Text style={styles.subtitleText}>my name is </Text>
        <View style={styles.contentView}>
          <Text style={styles.contentText}>Yi Quan✌(he/him)</Text>
        </View>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
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
  contentView: {
    flex: 1,
    width: "90%",
    height: "55%",
    backgroundColor: "grey",
    borderRadius: 30,
    justifyContent: "center",
  },
  contentText: {
    fontSize: 50,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
