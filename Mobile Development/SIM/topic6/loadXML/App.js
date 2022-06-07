import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { XMLParser } from "fast-xml-parser";

export default function App() {
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    fetch(
      "https://gist.githubusercontent.com/Pavneet-Sing/d0f3324f2cd3244a6ac8ffc5e8550102/raw/8ebc801b3e4d4987590958978ae58d3f931193a3/XMLResponse.xml"
    )
      .then((response) => response.text())
      .then((textResponse) => {
        const parser = new XMLParser();
        const obj = parser.parse(textResponse);
        setResponseData({
          firstName: obj.person.fname,
          lastName: obj.person.lname,
          contact: obj.person.contacts.personal.phone,
        });
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text>First Name: {responseData.firstName}</Text>
      <Text>Last Name: {responseData.lastName}</Text>
      <Text>Contact Number: {responseData.contact}</Text>
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
