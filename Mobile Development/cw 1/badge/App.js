import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

export default function App() {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  const [isHidden, setHidden] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, width: "100%", height: "100%" }}>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>hello</Text>
        <Text style={styles.subtitleText}>my name is </Text>
        {/* show hidden content when tap on the content box */}
        <TouchableWithoutFeedback onPress={() => setHidden((state) => !state)}>
          <View style={styles.contentView}>
            <Text style={styles.contentText}>Yi Quan✌(he/him)</Text>
            {isHidden ? null : (
              <Text>
                You found the hidden content, this is a short introduction of
                me. I am from Singapore and I am 26 years old this year. I
                graduated from Nanyang Polytechnic with Diploma In Business
                Informatics. I worked in a local SME for 1.5 years as a full
                stack developer after my National Service. The framework i used
                during my work are mainly reactjs and nodejs.
              </Text>
            )}
          </View>
        </TouchableWithoutFeedback>
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
    borderRadius: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  contentText: {
    fontSize: 50,
    fontWeight: "bold",
  },
});
