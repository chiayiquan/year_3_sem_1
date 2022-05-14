import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";

export default function App() {
  const tableData = [
    { header: "Section 1", cells: [{ title: "Cell 1" }, { title: "Cell 2" }] },
    { header: "Section 2", cells: [{ title: "Cell 1" }, { title: "Cell 2" }] },
  ];

  const CustomCell = (props) => (
    <Cell
      {...props}
      cellContentView={
        <View>
          <Text style={{ color: "red", fontWeight: "bold", fontSize: 50 }}>
            {props.customLabel}
          </Text>
        </View>
      }
    />
  );

  return (
    <SafeAreaView>
      <ScrollView style={{ height: "100%" }}>
        <TableView>
          {tableData.map((data) => (
            <Section header={data.header}>
              {data.cells.map((cellData) => (
                <CustomCell
                  customLabel={cellData.title}
                  key={cellData.title}
                  onPress={() => alert(data.header)}
                />
              ))}
            </Section>
          ))}
        </TableView>
      </ScrollView>
    </SafeAreaView>
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
