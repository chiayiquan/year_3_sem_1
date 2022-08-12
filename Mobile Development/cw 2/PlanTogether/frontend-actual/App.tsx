import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import Navigator from "./src/navigation/navigator";

export default function App() {
  return (
    <Provider store={store}>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Navigator />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
