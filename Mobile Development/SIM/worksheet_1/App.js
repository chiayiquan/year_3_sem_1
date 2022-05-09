import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Image source={require("./assets/logo.png")} style={styles.image} />
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={username}
          placeholderTextColor="white"
          onChangeText={(email) => setUsername(email)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={password}
          placeholderTextColor="white"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginContainer}>
        <Text style={styles.loginText}>login</Text>
      </TouchableOpacity>
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
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#3EB489",
    borderRadius: 10,
    width: "70%",
    height: 45,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "flex-start",
  },
  textInput: {
    height: 50,
  },
  loginContainer: {
    width: "70%",
    marginTop: 60,
    paddingVertical: 20,
    backgroundColor: "black",
    borderRadius: 50,
  },
  loginText: {
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
  },
  forgetPasswordText: {
    textDecorationLine: "underline",
  },
});
