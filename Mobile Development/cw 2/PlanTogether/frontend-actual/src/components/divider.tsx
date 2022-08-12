import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Divider({
  text,
  containerStyle,
  lineStyle,
}: {
  text: string;
  containerStyle?: {};
  lineStyle?: {};
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.line, lineStyle]} />
      {text.length > 0 ? <Text style={styles.text}>{text}</Text> : null}
      <View style={[styles.line, lineStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  line: {
    backgroundColor: "black",
    height: 2,
    flex: 1,
    alignSelf: "center",
  },
  text: {
    alignSelf: "center",
    paddingHorizontal: 5,
    fontSize: 14,
    textTransform: "uppercase",
  },
});
