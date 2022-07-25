import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return setErrorMsg("Permission denied");
      }

      const loc = await Location.getCurrentPositionAsync();

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=e45e42622ed53d05d76ae652fa170296`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      console.log(json);
      setLocation(json);
    })();
  }, []);

  function Content() {
    if (errorMsg != null) return <Text>There's been an error: {errorMsg}</Text>;
    else if (location != null) {
      return (
        <>
          <Text>{location.name}</Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`,
            }}
            style={{ width: 100, height: 100 }}
          />
        </>
      );
    }

    return <Text>Waiting....</Text>;
  }

  return (
    <View style={styles.container}>
      <Content />
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
});
