import { StyleSheet } from "react-native";

// global css
const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "90%",
    marginVertical: 10,
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    fontSize: 15,
  },
});

export default globalStyle;
