import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  function flipCamera() {
    setCameraType((state) =>
      state === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  if (hasPermission == null) {
    // this means we are in limbo between permission
    return <View />;
  } else if (hasPermission) {
    // we have permission
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={cameraType}>
          <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
            <Text>Flip</Text>
          </TouchableOpacity>
        </Camera>
      </View>
    );
  } else {
    // no permission to load camera
    return <Text>Access to camera is denied</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  flipButton: {
    backgroundColor: "white",
    position: "absolute",
    bottom: "10%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
