import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  Switch,
} from "react-native";
import { Cell, Section, TableView } from "react-native-tableview-simple";

export default function App() {
  return (
    <SafeAreaView>
      <ScrollView style={{ height: "100%" }}>
        <TableView>
          <Section>
            <Cell cellStyle="Basic" title="Basic cell" />
            <Cell
              cellStyle="RightDetail"
              title="Cell with right detail"
              detail="Detail"
            />
            <Cell
              cellStyle="LeftDetail"
              title="Cell with left detail"
              detail="Detail"
            />
          </Section>

          <Section header="Cells with accessories">
            <Cell
              cellStyle="Basic"
              accessory="DisclosureIndicator"
              onPress={() => alert("test!")}
              title="Basic cell with pressable!"
            />
            <Cell
              cellStyle="RightDetail"
              detail="Detail"
              accessory="DetailDisclosure"
              title="Cell with right detail"
            />
            <Cell
              cellStyle="Subtitle"
              accessory="Checkmark"
              title="Basic cell"
              detail="with subtitle! And checkmark"
            />
          </Section>

          <Section header="Cells with other elements">
            <Cell
              cellStyle="Basic"
              image={
                <Image
                  style={{ borderRadius: 5 }}
                  source={require("./assets/favicon.png")}
                />
              }
              title="Cell with image"
            />
            <Cell
              cellStyle="RightDetail"
              detail="Detail"
              rightDetailColor="red"
              title="Cell with custom detail colour"
            />
            <Cell
              cellStyle="Basic"
              cellAccessoryView={<Switch />}
              contentContainerStyle={{ paddingVertical: 4 }}
              title="Basic cell"
              detail="Cell with a switch"
            />
            <Cell
              cellStyle="Basic"
              cellAccessoryView={<ActivityIndicator />}
              contentContainerStyle={{ paddingVertical: 4 }}
              title="Basic cell"
              detail="Cell with a switch"
            />
            <Cell
              cellStyle="Basic"
              cellContentView={
                <TextInput
                  style={{ fontSize: 16, flex: 1 }}
                  placeholder="A text input cell"
                />
              }
            />
          </Section>

          <Section header="Custom cells">
            <Cell
              cellStyle="Basic"
              contentContainerStyle={{
                alignItems: "center",
                height: 60,
                backgroundColor: "lightblue",
              }}
              cellContentView={
                <Text
                  style={{
                    flex: 1,
                    fontSize: 16,
                    textAlign: "center",
                    color: "darkblue",
                    fontWeight: "bold",
                  }}
                >
                  Custom height, and content view
                </Text>
              }
            />
          </Section>
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
