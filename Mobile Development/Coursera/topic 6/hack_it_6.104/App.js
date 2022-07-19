import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import menuData from "./menu.json";

const Stack = createStackNavigator();

function VerticalMenu({ navigation }) {
  const { menu_items } = menuData;
  return (
    <View style={styles.vertical_menu}>
      <SafeAreaView>
        <Text style={styles.menuItemText}>+</Text>
        {menu_items.map((item) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(item.page)}
            key={item.page}
          >
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </View>
  );
}

function HomepageScreen({ navigation }) {
  return (
    <View style={styles.containerCenter}>
      <VerticalMenu navigation={navigation} />
    </View>
  );
}

function OfficeScreen() {
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.whiteText}>Office</Text>
    </View>
  );
}

function KitchenScreen() {
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.whiteText}>Kitchen</Text>
    </View>
  );
}

function BedroomScreen() {
  return (
    <View style={styles.containerCenter}>
      <Text style={styles.whiteText}>Bedroom</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomepageScreen}
        />
        <Stack.Screen
          name="Office"
          options={{
            headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" },
          }}
          component={OfficeScreen}
        />
        <Stack.Screen
          name="Kitchen"
          options={{
            headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" },
          }}
          component={KitchenScreen}
        />
        <Stack.Screen
          name="Bedroom"
          options={{
            headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" },
          }}
          component={BedroomScreen}
        />
      </Stack.Navigator>
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
  whiteText: {
    color: "white",
    fontSize: 30,
  },
  containerCenter: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  vertical_menu: {
    paddingLeft: 30,
    paddingTop: 100,
  },
  menuItemText: {
    fontSize: 70,
    fontWeight: "300",
    color: "white",
  },
});
