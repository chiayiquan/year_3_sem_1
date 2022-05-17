import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TableView, Section, Cell } from "react-native-tableview-simple";

function Restaurants({ navigation }) {
  const restaurantMenu = [
    {
      restaurantId: 1,
      // https://blacktap.com/restaurant-menu/singapore/
      items: [
        {
          title: "CRAFT BURGERS",
          contents: [
            {
              title: "THE ALL-AMERICAN BURGER",
              ingredients:
                "prime burger, lettuce, tomato, pickles, american cheese, special sauce",
              price: 23,
            },
            {
              title: "THE PIZZA BURGER",
              ingredients:
                "prime burger, zesty tomato sauce, fresh mozzarella, shaved parmesan",
              price: 24,
            },
            {
              title: "THE WAGYU STEAKHOUSE BURGER",
              ingredients:
                "wagyu patty, A1 steak sauce, pepper jack cheese, bacon, crispy onions, roasted garlic aioli",
              price: 29,
            },
            {
              title: "THE LAMB BURGER",
              ingredients:
                "grass-fed lamb burger, house-made pickles, swiss cheese, buttermilk dill",
              price: 24,
            },
            {
              title: "THE OLD FASHIONED",
              ingredients:
                "prime burger, shiitake mushrooms, swiss cheese, caramelized onion, horseradish sauce",
              price: 24,
            },
            {
              title: "THE IMPOSSIBLE ALL AMERICAN",
              ingredients: "impossible burger, american cheese, special sauce",
              price: 29,
            },
          ],
        },
        {
          title: "WINGS",
          contents: [
            {
              title: "SPICY KOREAN BBQ",
              ingredients:
                "toasted sesame seed & scallion, served with buttermilk-dill dressing",
              price: 15,
            },
            {
              title: "CAROLINA BBQ",
              ingredients:
                "sweet & smoky bbq, fresh herbs, served with house buttermilk-dill",
              price: 15,
            },
            {
              title: "TEXAN BBQ",
              ingredients:
                "Sweet bbq, scallion, served with house buttermilk-dill",
              price: 15,
            },
            {
              title: "MEXICAN HOT SAUCE",
              ingredients:
                "Spicy hot sauce, blue cheese crumbles, scallion, served with blue cheese dressing",
              price: 15,
            },
          ],
        },
        {
          title: "SNACKS & SIDES",
          contents: [
            {
              title: "SALTED EGG YOLK FRIES",
              ingredients:
                "salted egg yolk sauce, curry leaves, bird's eye chili, pickle mayo",
              price: 15,
            },
            {
              title: "BUTTERMILK FRIED CHICKEN TENDERS",
              ingredients:
                "with house buttermilk-dill, korean bbq & lime honey mustard",
              price: 15,
            },
            {
              title: "CAESAR SALAD",
              ingredients: "shaved parmesan, croutons",
              price: 10,
            },
            {
              title: "ARUGULA SALAD",
              ingredients: "roasted tomatoes, shaved parmesan",
              price: 10,
            },
          ],
        },
        {
          title: "CRAZYSHAKE",
          contents: [
            {
              title: "STRAWBERRY SHAKE",
              ingredients:
                "vanilla frosted rim with blue, pink & pearl chocolates topped with a pink lollipop, rock candy, whipped cream & cotton candy",
              price: 24,
            },
            {
              title: "CAKE BATTER SHAKE",
              ingredients:
                "vanilla frosted rim with rainbow sprinkles topped with a funfetti cake slice, whipped cream, rainbow sprinkles & a cherry *limited quantity per day",
              price: 22,
            },
            {
              title: "PEANUT BUTTER SHAKE",
              ingredients:
                "chocolate frosted rim with chocolate gems & PB cups topped with a sugar daddy, pretzel rods, chocolate covered pretzel, whipped cream & chocolate drizzle",
              price: 22,
            },
            {
              title: "OREO SHAKE",
              ingredients:
                "vanilla frosted rim with crushed oreos topped with a ‘cookies ’n cream’ sandwich, crumbled oreo, whipped cream & chocolate drizzle",
              price: 22,
            },
          ],
        },
      ],
    },
    {
      restaurantId: 2,
      items: [
        {
          title: "Gelato",
          contents: [{ title: "Vanilla" }],
        },
        {
          title: "Gelato",
          contents: [{ title: "Vanilla" }],
        },
      ],
    },
  ];

  const selectedRestaurantMenu = (id) =>
    restaurantMenu.filter((menu) => menu.restaurantId === id)[0];

  const allRestuarant = [
    {
      customTitle: "Joe's Gelato",
      tagline: "Western, Burger, $$$",
      eta: "10-30",
      imgUri: require("./assets/dan-gold-burger.jpg"),
      action: () => {
        return navigation.navigate("Menu", {
          menu: selectedRestaurantMenu(1).items,
        });
      },
      id: 1,
    },
    {
      customTitle: "Joe's Gelato",
      tagline: "Western, Burger, $$$",
      eta: "10-30",
      imgUri: require("./assets/adrien-olichon.jpg"),
      action: () =>
        navigation.navigate("Menu", selectedRestaurantMenu(2).items),
      id: 2,
    },
  ];

  const HomescreenCell = (props) => {
    return (
      <Cell
        {...props}
        backgroundColor="transparent"
        highlightActiveOpacity="#ccc"
        highlightUnderlayColor="#ccc"
        key={props.id}
        contentContainerStyle={{
          height: 290,
        }}
        onPress={props.action}
        cellContentView={
          <View style={styles.homeScreenContainer}>
            <Image
              source={props.imgUri}
              resizeMode="cover"
              style={styles.homeScreenImage}
            />
            <View style={styles.homeScreenEtaContainer}>
              <Text style={{ fontWeight: "bold" }}>{props.eta}</Text>
              <Text style={{ fontWeight: "bold" }}>mins</Text>
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 18, paddingTop: 5 }}>
              {props.customTitle}
            </Text>
            <Text style={{ fontSize: 12, color: "#a7a7a7" }}>
              {props.tagline}
            </Text>
          </View>
        }
      />
    );
  };

  return (
    <ScrollView>
      <TableView>
        <Section
          header=""
          hideSurroundingSeparators={true}
          separatorTintColor="#ccc"
        >
          {allRestuarant.map((restaurantData) => (
            <HomescreenCell {...restaurantData} />
          ))}
        </Section>
      </TableView>
    </ScrollView>
  );
}

function Menu({ route }) {
  const { menu } = route.params;
  return (
    <ScrollView>
      <TableView>
        {menu.map(({ title, contents }) => {
          return (
            <Section
              header={title}
              hideSurroundingSeparators={true}
              separatorTintColor="#ccc"
              key={title}
            >
              {contents.map(({ title: dish, price }) => (
                <Cell
                  cellStyle="RightDetail"
                  title={dish}
                  key={dish}
                  detail={`$${price}`}
                />
              ))}
            </Section>
          );
        })}
      </TableView>
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Restaurants"
          component={Restaurants}
          options={{
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{
            headerTitleAlign: "center",
            headerBackVisible: true,
            headerBackTitleVisible: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
    marginBottom: 5,
  },
  homeScreenImage: { flex: 1, width: "100%", borderRadius: 5 },
  homeScreenEtaContainer: {
    position: "absolute",
    borderWidth: 2,
    backgroundColor: "white",
    borderColor: "white",
    borderRadius: 30,
    width: "20%",
    alignItems: "center",
    bottom: 20,
    right: 20,
    padding: 5,
  },
});
