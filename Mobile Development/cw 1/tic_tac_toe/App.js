import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}></View>
      <View style={styles.gridContainer}>
        <View style={styles.rowContainer}>
          <View style={[styles.boxContainer, styles.bottomBorder]}>
            <Text style={styles.text}>O</Text>
          </View>
          <View
            style={[
              styles.boxContainer,
              styles.bottomBorder,
              styles.leftBorder,
            ]}
          >
            <Text style={styles.text}>O</Text>
          </View>
          <View
            style={[
              styles.boxContainer,
              styles.bottomBorder,
              styles.leftBorder,
            ]}
          >
            <Text style={styles.text}>X</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.boxContainer, styles.bottomBorder]}>
            <Text style={styles.text}>X</Text>
          </View>
          <View
            style={[
              styles.boxContainer,
              styles.bottomBorder,
              styles.leftBorder,
            ]}
          >
            <Text style={styles.text}>O</Text>
          </View>
          <View
            style={[
              styles.boxContainer,
              styles.bottomBorder,
              styles.leftBorder,
            ]}
          >
            <Text style={styles.text}>O</Text>
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.boxContainer]}>
            <Text style={styles.text}>X</Text>
          </View>
          <View style={[styles.boxContainer, styles.leftBorder]}>
            <Text style={styles.text}>X</Text>
          </View>
          <View style={[styles.boxContainer, styles.leftBorder]}>
            <Text style={styles.text}>O</Text>
          </View>
        </View>
      </View>
      <View style={styles.gridContainer}></View>
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
  gridContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    paddingHorizontal: "2%",
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  boxContainer: {
    width: "31%",
    height: "100%",
  },
  leftBorder: {
    borderLeftColor: "black",
    borderLeftWidth: 3,
  },
  bottomBorder: {
    borderBottomColor: "black",
    borderBottomWidth: 3,
  },
  text: {
    fontWeight: "bold",
    fontSize: 50,
    textAlign: "center",
  },
});
