import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={[styles.segment, { backgroundColor: "gray" }]}>
        <TouchableOpacity style={[styles.button, styles.skeuomorphicButton]}>
          <LinearGradient
            // Background Linear Gradient
            colors={["#F93a3a", "#BA0E0E"]}
            style={styles.skeuomorphicShift}
          />
          <LinearGradient
            // Background Linear Gradient
            colors={["#BA0E0E", "#F93a3a"]}
            style={styles.skeumorphicGradientStyling}
          >
            <Text style={styles.skeumorphicLabel}>Skeuomorphic</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={[styles.segment, { backgroundColor: "white" }]}>
        <TouchableOpacity style={[styles.button, styles.minimalistButton]}>
          <Text style={styles.minimalistLabel}>Minimalist</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.segment, { backgroundColor: "#e0e0e0" }]}>
        <View style={[styles.button, styles.neuButtonSecondShadow]} />
        <TouchableOpacity style={[styles.button, styles.neuButton]}>
          <Text style={styles.neuLabel}>Neumorphic</Text>
        </TouchableOpacity>
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
  segment: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    height: 70,
    marginTop: 50,
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  minimalistButton: {
    borderColor: "purple",
    borderWidth: 3,
    borderRadius: 70,
  },
  minimalistLabel: {
    color: "purple",
    fontSize: 17,
  },
  neuButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 30,
    shadowColor: "#bebebe",
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: 0.9,
    shadowRadius: 30,
    elevation: 12,
  },
  neuButtonSecondShadow: {
    position: "absolute",
    backgroundColor: "#e0e0e0",
    width: 200,
    height: 70,
    borderRadius: 30,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: -20,
      height: -20,
    },
    shadowOpacity: 1.0,
    shadowRadius: 30,
    elevation: 12,
  },
  neuLabel: {
    color: "black",
    fontSize: 17,
  },
  skeuomorphicButton: {
    height: 75,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 37.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  skeumorphicGradientStyling: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  skeuomorphicShift: {
    position: "absolute",
    width: 200,
    height: 75,
    top: 0,
    left: 0,
    zIndex: -1,
    borderRadius: 37.5,
  },
  skeumorphicLabel: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    textShadowColor: "#Af0e0e",
  },
});
