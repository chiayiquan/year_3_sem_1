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
  // store answer/keyed in number
  const [answerValue, setAnswerValue] = useState("0");
  const [readyToReplace, setReadyToReplace] = useState(true);
  // memoryValue is all the number that is keyed in previous, stored in array
  const [memoryValue, setMemoryValue] = useState([]);
  // operatorValue is all the operation that is keyed in previous, stored in array
  const [operatorValue, setOperatorValue] = useState([]);
  // to display the equation if equal is pressed else it will always be set to empty string
  const [displayEquation, setDisplayEquation] = useState("");

  const divideUnicode = "\u00F7";
  const multiplyUnicode = "\u00D7";

  function handleNumber(currentValue, buttonValue) {
    setDisplayEquation("");
    if (readyToReplace) {
      setReadyToReplace(false);
      return buttonValue;
    } else {
      return parseFloat(currentValue) > 0 && currentValue.length < 30
        ? currentValue + buttonValue
        : currentValue;
    }
  }

  function handleOperator(operation) {
    setDisplayEquation("");
    setMemoryValue((state) =>
      isNaN(parseFloat(answerValue))
        ? state
        : [...state, parseFloat(answerValue)]
    );
    setOperatorValue((state) => {
      if (readyToReplace && answerValue === "") {
        const newState = [...state];
        newState[newState.length - 1] = operation;
        return newState;
      }
      return [...state, operation];
    });
    setReadyToReplace(true);
    setAnswerValue("");
  }

  function handlePositiveNegative() {
    setDisplayEquation("");
    setReadyToReplace(false);
    setAnswerValue((state) =>
      (parseFloat(state) - parseFloat(state) * 2).toString()
    );
  }

  function handlePercentage() {
    setDisplayEquation("");
    setReadyToReplace(false);
    setAnswerValue((state) => (parseFloat(state) * 0.01).toString());
  }

  function multiplyDivide(operationArr, memoryValueArr, index = 0) {
    // if there is no multiply and divide in the array, exit the recursion
    if (!operationArr.includes("*") && !operationArr.includes("/")) {
      return memoryValueArr;
    }
    if (operationArr[index] === "*" || operationArr[index] === "/") {
      // operation will always be executed with current index number and operator with the next index number
      memoryValueArr[index] =
        operationArr[index] === "*"
          ? memoryValueArr[index] * memoryValueArr[index + 1]
          : memoryValueArr[index] / memoryValueArr[index + 1];

      // will mutate the variable from calculateTotal
      // remove the operator from the operationArr
      operationArr.splice(index, 1);
      // remove the next element from memoryValueArr
      memoryValueArr.splice(index + 1, 1);
      return multiplyDivide(operationArr, memoryValueArr, index);
    } else {
      // if current operator is plus or minus, move to next index
      multiplyDivide(operationArr, memoryValueArr, index + 1);
    }
  }

  function plusMinus(operationArr, memoryValueArr, index = 0) {
    // if there is no plus and minus in the array, exit the recursion
    if (!operationArr.includes("+") && !operationArr.includes("-")) {
      return memoryValueArr;
    }
    if (operationArr[index] === "+" || operationArr[index] === "-") {
      // operation will always be executed with current index number and operator with the next index number
      memoryValueArr[index] =
        operationArr[index] === "+"
          ? memoryValueArr[index] + memoryValueArr[index + 1]
          : memoryValueArr[index] - memoryValueArr[index + 1];

      // will mutate the variable from calculateTotal
      // remove the operator from the operationArr
      operationArr.splice(index, 1);
      // remove the next element from memoryValueArr
      memoryValueArr.splice(index + 1, 1);
      return plusMinus(operationArr, memoryValueArr, index);
    } else {
      // if current operator is multiply or divide, move to next index
      return plusMinus(operationArr, memoryValueArr, index + 1);
    }
  }

  function calculateTotal(operationArr, memoryValueArr) {
    const tempMemoryValueArr = [...memoryValueArr];
    // do multiply and divide first, then plus and minus
    multiplyDivide(operationArr, tempMemoryValueArr);
    plusMinus(operationArr, tempMemoryValueArr);

    // return the total
    return tempMemoryValueArr[0];
  }

  function calculateEquals() {
    const operationArr = [...operatorValue];
    const memoryValueArr = [...memoryValue, parseFloat(answerValue)];

    const total = calculateTotal(operationArr, memoryValueArr);

    // set the displayEquation to be an equation
    setDisplayEquation(
      memoryValueArr.reduce((accumulator, currentValue, index) => {
        currentValue = formatNumber(currentValue);
        return index >= operatorValue.length
          ? `${accumulator}${currentValue}`
          : `${accumulator}${currentValue}${replaceSign(operatorValue[index])}`;
      }, "")
    );
    setAnswerValue(total.toString());
    setMemoryValue([]);
    setOperatorValue([]);
    setReadyToReplace(true);
  }

  function handleDecimal() {
    setDisplayEquation("");
    setReadyToReplace(false);
    return setAnswerValue((state) =>
      state.indexOf(".") !== -1 ? state : `${state}.`
    );
  }

  function clear() {
    setAnswerValue("0");
    setMemoryValue([]);
    setOperatorValue([]);
    setDisplayEquation("");
    return setReadyToReplace(true);
  }

  function displayKeyedValue() {
    return displayEquation.length === 0
      ? memoryValue.reduce((accumulator, currentValue, index) => {
          currentValue = formatNumber(currentValue);
          return index > operatorValue.length
            ? `${accumulator}${currentValue}`
            : `${accumulator}${currentValue}${replaceSign(
                operatorValue[index]
              )}`;
        }, "") + formatNumber(answerValue)
      : `${displayEquation}\n=${formatNumber(answerValue)}`;
  }
  function formatNumber(numberStr) {
    let splitDecimal = numberStr.toString().split(".");
    splitDecimal[0] = splitDecimal[0]
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return splitDecimal.join(".");
  }

  function replaceSign(operator) {
    switch (operator) {
      case "+":
        return "+";
      case "-":
        return "-";
      case "/":
        return divideUnicode;
      case "*":
        return multiplyUnicode;
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.result}>{displayKeyedValue()}</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.lightGrayButton]}
            onPress={clear}
          >
            <Text style={[styles.buttonText, styles.blackButtonText]}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.lightGrayButton]}
            onPress={handlePositiveNegative}
          >
            <Text style={[styles.buttonText, styles.blackButtonText]}>+/-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.lightGrayButton]}
            onPress={handlePercentage}
          >
            <Text style={[styles.buttonText, styles.blackButtonText]}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.blueButton]}
            onPress={() => handleOperator("/")}
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>
              {divideUnicode}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "7"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "8"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "9"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.blueButton]}
            onPress={() => handleOperator("*")}
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>
              {multiplyUnicode}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "4"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "5"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "6"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.blueButton]}
            onPress={() => handleOperator("-")}
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "1"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "2"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "3"))
            }
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.blueButton]}
            onPress={() => handleOperator("+")}
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.grayButton, { flex: 1 }]}
            onPress={() =>
              setAnswerValue((currentValue) => handleNumber(currentValue, "0"))
            }
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
          <TouchableOpacity
            style={[styles.button, styles.grayButton]}
            onPress={handleDecimal}
          >
            <Text style={[styles.buttonText, styles.whiteButtonText]}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.blueButton]}
            onPress={calculateEquals}
          >
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
    fontSize: 40,
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
