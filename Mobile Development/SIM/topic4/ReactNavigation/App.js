import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Go To Details"
        onPress={() =>
          navigation.navigate("Details", {
            itemName: "testing",
            itemDescrip: "description",
          })
        }
      />
    </View>
  );
}

function DetailsScreen({ navigation, route }) {
  const { itemName, itemDescrip } = route.params;

  return (
    <View style={styles.container}>
      <Text>Details Screen</Text>
      <Text>Name: {itemName}</Text>
      <Text>Description: {itemDescrip}</Text>
      <Button
        title="Go To Details... again"
        onPress={() => navigation.push("Details", { itemName, itemDescrip })}
      />
      <Button title="Go To Home" onPress={() => navigation.navigate("Home")} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go Back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
function HomeScreenNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Overview" }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home Screen"
          component={HomeScreenNavigator}
          options={{ tabBarBadge: 5, headerShown: false }}
        />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
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
