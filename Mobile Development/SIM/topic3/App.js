import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Switch,
  Image,
  ImageBackground,
} from "react-native";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [name, setName] = useState("Mobile Development");

  const changeName = () => {
    setName("Hello World");
  };

  const toggleSwitch = () => {
    setIsEnabled((state) => !state);
  };

  setTimeout(() => {
    setIsLoading(false);
    clearTimeout(this);
  }, 3000);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./assets/favicon.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text>My name is {name}</Text>
        <Text>Open up App.js to start working on your app!</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button onPress={changeName} title="Click here" color="red" />
        )}

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1650846852086-a2a172d34dc5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
          style={{ width: 100, height: 100, resizeMode: "cover" }}
        />

        <StatusBar style="auto" />
      </ImageBackground>
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
    flex: 1,
    justifyContent: "center",
  },
});
