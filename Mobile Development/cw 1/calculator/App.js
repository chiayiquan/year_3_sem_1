import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

const deviceWidth = Dimensions.get("screen").width;
const buttonWidth = deviceWidth / 5;
export default function App() {
  const [answerValue, setAnswerValue] = useState(0);
  const [readyToReplace, setReadyToReplace] = useState(true);

  function handleNumber(buttonValue) {
    if (readyToReplace) {
      setReadyToReplace((state) => !state);
      return buttonValue;
    } else return parseInt(answerValue.toString() + buttonValue.toString());
  }
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.result}>{answerValue}</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.lightGrayButton]}
            onPress={() => alert("dummy")}
          >
            <Text style={[styles.buttonText, styles.blackButtonText]}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.lightGrayButton]}>
            <Text style={[styles.buttonText, styles.blackButtonText]}>+/-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.lightGrayButton]}>
            <Text style={[styles.buttonText, styles.blackButtonText]}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.blueButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>/</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() => setAnswerValue(handleNumber(7))}
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() => setAnswerValue(handleNumber(8))}
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.grayButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.blueButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>X</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.grayButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.grayButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.grayButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.blueButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.grayButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.grayButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.grayButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.blueButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.grayButton, { flex: 1 }]}
          >
            <Text
              style={[
                styles.buttonText,
                styles.whiteButtonText,
                { marginRight: "50%" },
              ]}
            >
              0
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.grayButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.blueButton]}>
            <Text style={[styles.buttonText, styles.whiteButtonText]}>=</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  result: {
    fontSize: 50,
    color: "white",
    marginRight: 20,
    textAlign: "right",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: "1%",
  },
  button: {
    width: buttonWidth,
    height: buttonWidth,
    borderRadius: 50,
    marginHorizontal: "2%",
  },
  lightGrayButton: {
    backgroundColor: "#a6a7a6",
  },
  grayButton: {
    backgroundColor: "#333333",
  },
  blueButton: {
    backgroundColor: "#0883e2",
  },
  buttonText: {
    fontSize: 30,
    textAlign: "center",
    marginTop: buttonWidth / 4,
  },
  blackButtonText: {
    color: "black",
  },
  whiteButtonText: {
    color: "white",
  },
});
