import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";

export default function App() {
  const buttonList = [
    {
      source: require("./assets/home.png"),
      text: "Home",
      onPress: () => alert("Pressed home!"),
    },
    {
      source: require("./assets/message.png"),
      text: "Messages",
      onPress: () => alert("Pressed message!"),
    },
    {
      source: require("./assets/user.png"),
      text: "Profile",
      onPress: () => alert("Pressed user!"),
    },
    {
      source: require("./assets/settings.png"),
      text: "Settings",
      onPress: () => alert("Pressed settings!"),
    },
  ];

  function TabButton({ source, text, onPress }) {
    console.log(text);
    return (
      <TouchableOpacity style={styles.tabButton} onPress={onPress}>
        <Image source={source} style={styles.tabImage} />
        <Text style={styles.tabText}>{text}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.toolKitBar}>
          {buttonList.map(({ source, text, onPress }) => (
            <TabButton source={source} text={text} onPress={onPress} />
          ))}
        </View>
      </SafeAreaView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  toolKitBar: {
    width: "100%",
    height: 50,
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    marginLeft: "2%",
    marginRight: "2%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontWeight: "bold",
    fontSize: 10,
    marginTop: 5,
  },
  tabImage: {
    width: 20,
    height: 20,
  },
});
