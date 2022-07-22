import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // the user has denied or auto deny
        return setErrorMsg("The user has not granted permission");
      }

      console.log("Permission has been granted");

      const location = await Location.getCurrentPositionAsync();
      console.log(location);

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const potentialAddress = address[0];
      const addressStr = `${potentialAddress.name}\n${potentialAddress.street}\n${potentialAddress.district}\n${potentialAddress.subregion}\n${potentialAddress.postalCode}`;

      console.log(addressStr);
      setLocation(addressStr);
    })();
  }, []);

  const message = "Waiting.....";

  return (
    <View style={styles.container}>
      <Text>{location || errorMsg || message}</Text>
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
