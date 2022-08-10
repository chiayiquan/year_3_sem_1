import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import Navigation from "./src/index";

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Navigation />
      </SafeAreaView>
    </Provider>
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
