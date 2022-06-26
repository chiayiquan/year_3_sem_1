import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
              description:
                "prime burger, lettuce, tomato, pickles, american cheese, special sauce",
              price: 23,
              source: require("./assets/images/joe-burger/all-american-burger.jpg"),
              availability: false,
            },
            {
              title: "THE PIZZA BURGER",
              description:
                "prime burger, zesty tomato sauce, fresh mozzarella, shaved parmesan",
              price: 24,
              source: require("./assets/images/joe-burger/pizza-burger.jpg"),
              availability: true,
            },
            {
              title: "THE WAGYU STEAKHOUSE BURGER",
              description:
                "wagyu patty, A1 steak sauce, pepper jack cheese, bacon, crispy onions, roasted garlic aioli",
              price: 29,
              source: require("./assets/images/joe-burger/wagyu-burger.jpg"),
              availability: true,
            },
            {
              title: "THE LAMB BURGER",
              description:
                "grass-fed lamb burger, house-made pickles, swiss cheese, buttermilk dill",
              price: 24,
              source: require("./assets/images/joe-burger/lamb-burger.jpg"),
              availability: true,
            },
            {
              title: "THE OLD FASHIONED",
              description:
                "prime burger, shiitake mushrooms, swiss cheese, caramelized onion, horseradish sauce",
              price: 24,
              source: require("./assets/images/joe-burger/old-fashioned-burger.jpg"),
              availability: true,
            },
            {
              title: "THE IMPOSSIBLE ALL AMERICAN",
              description: "impossible burger, american cheese, special sauce",
              price: 29,
              source: require("./assets/images/joe-burger/impossible-burger.jpg"),
              availability: true,
            },
          ],
        },
        {
          title: "WINGS",
          contents: [
            {
              title: "SPICY KOREAN BBQ",
              description:
                "toasted sesame seed & scallion, served with buttermilk-dill dressing",
              price: 15,
              source: require("./assets/images/joe-burger/spicy-korea-wings.jpg"),
              availability: true,
            },
            {
              title: "CAROLINA BBQ",
              description:
                "sweet & smoky bbq, fresh herbs, served with house buttermilk-dill",
              price: 15,
              source: require("./assets/images/joe-burger/carolina-wings.jpg"),
              availability: true,
            },
            {
              title: "TEXAN BBQ",
              description:
                "Sweet bbq, scallion, served with house buttermilk-dill",
              price: 15,
              source: require("./assets/images/joe-burger/texan-bbq-wings.jpg"),
              availability: true,
            },
            {
              title: "MEXICAN HOT SAUCE",
              description:
                "Spicy hot sauce, blue cheese crumbles, scallion, served with blue cheese dressing",
              price: 15,
              source: require("./assets/images/joe-burger/mexican-hot-sauce-wings.jpg"),
              availability: true,
            },
          ],
        },
        {
          title: "SNACKS & SIDES",
          contents: [
            {
              title: "SALTED EGG YOLK FRIES",
              description:
                "salted egg yolk sauce, curry leaves, bird's eye chili, pickle mayo",
              price: 15,
              source: require("./assets/images/joe-burger/salted-egg-yolk-fries.jpg"),
              availability: true,
            },
            {
              title: "BUTTERMILK FRIED CHICKEN TENDERS",
              description:
                "with house buttermilk-dill, korean bbq & lime honey mustard",
              price: 15,
              source: require("./assets/images/joe-burger/buttermilk-chicken-tender.jpg"),
              availability: false,
            },
            {
              title: "CAESAR SALAD",
              description: "shaved parmesan, croutons",
              price: 10,
              source: require("./assets/images/joe-burger/caesar-salad.jpg"),
              availability: true,
            },
            {
              title: "ARUGULA SALAD",
              description: "roasted tomatoes, shaved parmesan",
              price: 10,
              source: require("./assets/images/joe-burger/arugula-salad.jpg"),
              availability: true,
            },
          ],
        },
        {
          title: "CRAZYSHAKE",
          contents: [
            {
              title: "STRAWBERRY SHAKE",
              description:
                "vanilla frosted rim with blue, pink & pearl chocolates topped with a pink lollipop, rock candy, whipped cream & cotton candy",
              price: 24,
              source: require("./assets/images/joe-burger/strawberry-milkshake.jpg"),
              availability: true,
            },
            {
              title: "CAKE BATTER SHAKE",
              description:
                "vanilla frosted rim with rainbow sprinkles topped with a funfetti cake slice, whipped cream, rainbow sprinkles & a cherry *limited quantity per day",
              price: 22,
              source: require("./assets/images/joe-burger/cake-batter-milkshake.jpg"),
              availability: true,
            },
            {
              title: "PEANUT BUTTER SHAKE",
              description:
                "chocolate frosted rim with chocolate gems & PB cups topped with a sugar daddy, pretzel rods, chocolate covered pretzel, whipped cream & chocolate drizzle",
              price: 22,
              source: require("./assets/images/joe-burger/peanut-butter-milkshake.jpg"),
              availability: true,
            },
            {
              title: "OREO SHAKE",
              description:
                "vanilla frosted rim with crushed oreos topped with a ‘cookies ’n cream’ sandwich, crumbled oreo, whipped cream & chocolate drizzle",
              price: 22,
              source: require("./assets/images/joe-burger/oreo-milkshake.jpg"),
              availability: true,
            },
          ],
        },
      ],
    },
    {
      restaurantId: 2,
      // https://static1.squarespace.com/static/5d09c24ef3d12d000101d11a/t/6228497bf2e94d772d4221a7/1646807523445/COLLIN%27S+MENU+MARCH+2022.pdf
      items: [
        {
          title: "APPETISER",
          contents: [
            {
              title: "Forest Mushroom Soup",
              description: "Fresh Button Mushroom, Fresh Cream and Croutons",
              price: 6.5,
              source: require("./assets/images/joe-western/mushroom-soup.jpg"),
              availability: true,
            },
            {
              title: "Minestrone",
              description:
                "Rich Tomato Soup, Onion, Celery, Carrot, Chifferi Pasta",
              price: 6,
              source: require("./assets/images/joe-western/minestrone.jpg"),
              availability: true,
            },
            {
              title: "Homemade Garlic Bread",
              description: "Toasted French Loaf with Homemade Garlic Butter",
              price: 29,
              source: require("./assets/images/joe-western/garlic-bread.jpg"),
              availability: true,
            },
            {
              title: "Crispy Szechuan Mala Chicken Wings(5 pcs)",
              description: "with Shoestring Fries",
              price: 9.5,
              source: require("./assets/images/joe-western/mala-wings.jpg"),
              availability: true,
            },
          ],
        },

        {
          title: "SALAD",
          contents: [
            {
              title: "Smoked Duck Salad",
              description:
                "Smoked Duck Breast, Japanese Cucumber, Cherry Tomato, Mixed Mesclun with Calamansi Dressing",
              price: 11,
              source: require("./assets/images/joe-western/smoked-duck-salad.jpg"),
              availability: true,
            },
            {
              title: "Sea Prawn Salad",
              description:
                "Sea Prawn, Japanese Cucumber, Mixed Mesclun with Thousand Island Dressing",
              price: 12,
              source: require("./assets/images/joe-western/sea-prawn-salad.jpg"),
              availability: true,
            },
            {
              title: "Salmon Nicoise Salad",
              description:
                "Tender Salmon, Pitted Black Olive, Cherry Tomato, Mixed Mesclun, Egg, Fine Beans with French Dressing",
              price: 13,
              source: require("./assets/images/joe-western/salmon-nicoise-salad.jpg"),
              availability: true,
            },
            {
              title: "Classic Caesar Salad",
              description:
                "Mixed Mesclun, Egg, Croutons, Bacon and Parmesan Cheese",
              price: 10,
              source: require("./assets/images/joe-western/caesar-salad.jpg"),
              availability: true,
            },
          ],
        },

        {
          title: "PASTA",
          contents: [
            {
              title: "Seafood Marinara",
              description:
                "Spaghetti, Mussel, Squid, Clam, Prawn in Tomato Herb Sauce",
              price: 17,
              source: require("./assets/images/joe-western/seafood-marinara.jpg"),
              availability: true,
            },
            {
              title: "Classic Carbonara",
              description:
                "Spaghetti, Bacon, Mushroom and Ham in Cream Sauce, topped with a Sunny Side Up Egg",
              price: 16,
              source: require("./assets/images/joe-western/carbonara.jpg"),
              availability: true,
            },
            {
              title: "Angus Beef Bolognese",
              description:
                "Spaghetti in Rich Tomato Meat Sauce, topped with a Sunny Side Up Egg",
              price: 16,
              source: require("./assets/images/joe-western/bolognese.jpg"),
              availability: true,
            },
            {
              title: "Cacio e Pepe Ravioli",
              description:
                "Ravioli stuffed with Cheese, Medley of Mushrooms, Grated Parmesan and Cream Sauce",
              price: 17,
              source: require("./assets/images/joe-western/ravioli.jpg"),
              availability: true,
            },
          ],
        },

        {
          title: "SEAFOOD",
          contents: [
            {
              title: "Bi Feng Tang Fish & Chips",
              description:
                "Coleslaw, Shoestring Fries, Corn Cob, Mesclun Salad with Cheese Sauce and Garlic Aioli",
              price: 20,
              source: require("./assets/images/joe-western/bi-tang-fish-and-chip.jpg"),
              availability: true,
            },
            {
              title: "Bi Feng Tang Fish & Tempura Calamari",
              description:
                "Coleslaw, Shoestring Fries, Corn Cob, Mesclun Salad with Cheese Sauce and Garlic Aioli",
              price: 25,
              source: require("./assets/images/joe-western/bi-tang-fish-and-calamari.jpg"),
              availability: true,
            },
            {
              title: "Grilled Premium White Fish",
              description:
                "Spaghetti Aglio Olio, Corn Cob, Mesclun Salad with Black Pepper Sauce",
              price: 20,
              source: require("./assets/images/joe-western/grilled-white-fish.jpg"),
              availability: true,
            },
            {
              title: "Charcoal-Grilled Salmon",
              description:
                "Spaghetti Aglio Olio, Corn Cob, Mesclun Saladwith Mango Salsa",
              price: 24,
              source: require("./assets/images/joe-western/grilled-salmon.jpg"),
              availability: false,
            },
          ],
        },

        {
          title: "MEAT",
          contents: [
            {
              title: "Signature Crispy Chicken Cutlet",
              description:
                "Brown Flour-coated Chicken Cutlet with Coleslaw, Shoestring Fries, Corn Cob, Mesclun Salad with Cheese Sauce and Garlic Aioli",
              price: 17,
              source: require("./assets/images/joe-western/crispy-chicken-cutlet.jpg"),
              availability: true,
            },
            {
              title: "Roasted Free Range Chicken",
              description:
                "Coleslaw, Shoestring Fries, Corn Cob, Mesclun Salad with Chicken Gravy",
              price: 18,
              source: require("./assets/images/joe-western/roasted-chicken.jpg"),
              availability: false,
            },
            {
              title: "Chicken & Fish Combo",
              description:
                "Signature Chicken Chop, Bi Feng Tang Fish Fillet, Potato Au Gratin, Corn Cob, Seasonal Vegetables, Garlic Aioli and Black Pepper Sauce ",
              price: 26,
              source: require("./assets/images/joe-western/chicken-and-fish-combo.jpg"),
              availability: true,
            },
          ],
        },
      ],
    },
    {
      restaurantId: 3,
      // https://www.quandoo.sg/place/andersens-of-denmark-ice-cream-jurong-point-90355/menu#content
      items: [
        {
          title: "SHARED DISHES",
          contents: [
            {
              title: "Couple Fondue",
              description:
                "A Smaller version of Family Fondue, enjoy sweet moments with your partner as you dip into Andersen’s premium chocolate liquid. Comes with 5 scoops of rich and creamy Andersen’s ice cream. Superb",
              price: 23.9,
              source: require("./assets/images/joe-ice-cream/couple-fondue.jpg"),
              availability: true,
            },
            {
              title: "Family Fondue",
              description:
                "The perfect get-together dessert to share with your family and friends! Choose from 10 different delectable flavours to match everyone’s favourite! Comes with seasonal fresh fruits, waffle cones, homemade cookies, marshmallows and rich and creamy Andersen’s ice cream all waiting to be dipped into in our thick and warm premium chocolate liquid. Heavenly!",
              price: 37.9,
              source: require("./assets/images/joe-ice-cream/family-fondue.jpg"),
              availability: true,
            },
          ],
        },

        {
          title: "DESSERTS",
          contents: [
            {
              title: "Lava Indulgence",
              description:
                "Chocolate Lava Cakes are ultra irresistible, decadent and gourmet. Pair up with triple scoop of Andersen’s ice cream to make it outright heavenly!",
              price: 15.9,
              source: require("./assets/images/joe-ice-cream/lava-cake.jpg"),
              availability: true,
            },
            {
              title: "Banana Split",
              description:
                "The all time favourite that certainly sweeten up your day. Comes with banana, 3 scoops of rich and creamy Andersen’s ice cream, waffle cone, fresh cream and chocolate drizzle.Simply irresistible!",
              price: 15.9,
              source: require("./assets/images/joe-ice-cream/banana-split.jpg"),
              availability: true,
            },
            {
              title: "Banana Delight",
              description:
                "All time favourite with the banana and almonds combinations. Mouthwatering rich melty ice cream can’t go wrong with these danish waffles",
              price: 15.9,
              source: require("./assets/images/joe-ice-cream/banana-delight.jpg"),
              availability: true,
            },
            {
              title: "Classic",
              description:
                "Comes with 5 scoops of delectable Andersen’s ice Cream, served in a crispy chocolate dipped waffle basket. Satisfy your craving with this classic choice!",
              price: 16.9,
              source: require("./assets/images/joe-ice-cream/classic.jpg"),
              availability: true,
            },
          ],
        },

        {
          title: "SMOOTHIES",
          contents: [
            {
              title: "Banana Smoothie",
              description:
                "Smooth low fat frozen yogurt blended with skimmed milk and fresh bananas. Go bananas over it!",
              price: 6.5,
              source: require("./assets/images/joe-ice-cream/banana-smoothie.jpg"),
              availability: true,
            },
            {
              title: "Peachy Mango Smoothie",
              description:
                "A healthy yummy treat with Peach and Mango blended with low fat frozen yogurt and skimmed milk.",
              price: 6.5,
              source: require("./assets/images/joe-ice-cream/peachy-mango-smoothie.jpg"),
              availability: true,
            },
            {
              title: "Berries Smoothie",
              description:
                "A berry delicious drink with blended Blueberries, Mango and Peach, low fat frozen yogurt and skimmed milk.",
              price: 6.5,
              source: require("./assets/images/joe-ice-cream/berries-smoothie.jpg"),
              availability: true,
            },
            {
              title: "Raspberries Smoothie",
              description:
                "Raspberries, Mango and Bananas blended with low fat yogurt and skimmed milk. The perfect Tropical treat!",
              price: 6.5,
              source: require("./assets/images/joe-ice-cream/raspberries-smoothie.jpg"),
              availability: true,
            },
          ],
        },
      ],
    },
  ];

  const selectedRestaurantMenu = (id) =>
    restaurantMenu.filter((menu) => menu.restaurantId === id)[0];

  const navigateToMenu = (id) =>
    navigation.navigate("Menu", {
      menu: selectedRestaurantMenu(id).items,
    });

  const allRestuarant = [
    {
      customTitle: "Joe's burger",
      tagline: "Western, Burger, $$$",
      eta: "10-30",
      imgUri: require("./assets/images/joe-burger.jpg"),
      action: () => navigateToMenu(1),
      id: 1,
    },
    {
      customTitle: "Joe's Western",
      tagline: "Western, Fine Dining, $$$",
      eta: "45-60",
      imgUri: require("./assets/images/joe-western.jpg"),
      action: () => navigateToMenu(2),
      id: 2,
    },
    {
      customTitle: "Joe's Ice Cream",
      tagline: "Ice Cream, Dessert, $$$",
      eta: "10-15",
      imgUri: require("./assets/images/joe-ice-cream.jpg"),
      action: () => navigateToMenu(3),
      id: 3,
    },
  ];

  function HomescreenCell(props) {
    return (
      <Cell
        {...props}
        backgroundColor="transparent"
        highlightActiveOpacity="#ccc"
        highlightUnderlayColor="#ccc"
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
  }

  return (
    <ScrollView>
      <TableView>
        <Section
          header=""
          hideSurroundingSeparators={true}
          separatorTintColor="#ccc"
        >
          {allRestuarant.map((restaurantData) => (
            <HomescreenCell {...restaurantData} key={restaurantData.id} />
          ))}
        </Section>
      </TableView>
    </ScrollView>
  );
}

function Menu({ route }) {
  const { menu } = route.params;
  const [showModal, setShowModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState({});

  function selectDish(dishDetail) {
    setSelectedDish(dishDetail);
    return setShowModal(true);
  }

  function ModalPopUp() {
    const { title, price, source, description, availability } = selectedDish;
    return (
      <Modal visible={showModal} animationType="slide">
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              marginBottom: 20,
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>{title}</Text>
            <TouchableOpacity>
              <AntDesign
                name="close"
                size={24}
                color="black"
                onPress={() => setShowModal(false)}
              />
            </TouchableOpacity>
          </View>
          <View style={{ height: "40%", paddingHorizontal: 10 }}>
            <Image
              source={source}
              resizeMode="stretch"
              style={{ flex: 1, width: "100%" }}
            />
          </View>
          <View style={{ paddingHorizontal: 10, paddingTop: "2%" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Description
            </Text>
            <Text style={{ fontSize: 16 }}>{description}</Text>

            <Text
              style={{ fontSize: 18, fontWeight: "bold", paddingTop: "1%" }}
            >
              Price
            </Text>
            <Text style={{ fontSize: 16 }}>${price}</Text>

            <Text
              style={{ fontSize: 18, fontWeight: "bold", paddingTop: "1%" }}
            >
              Availability
            </Text>
            {availability ? (
              <Text
                style={{
                  textTransform: "uppercase",
                  fontSize: 14,
                  color: "green",
                }}
              >
                in stock
              </Text>
            ) : (
              <Text
                style={{
                  textTransform: "uppercase",
                  fontSize: 14,
                  color: "red",
                }}
              >
                out of stock
              </Text>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  const TableList = ({ title, contents }) => (
    <Section
      header={title}
      hideSurroundingSeparators={true}
      separatorTintColor="#ccc"
      key={title}
    >
      {contents.map(
        ({ title: dishTitle, price, source, description, availability }) => (
          <Cell
            cellStyle="Subtitle"
            cellAccessoryView={
              <Text style={{ color: availability ? "black" : "#666666" }}>
                ${price}
              </Text>
            }
            title={
              <Text>
                {dishTitle}{" "}
                {!availability && (
                  <Text
                    style={{
                      textTransform: "uppercase",
                      fontSize: 10,
                      color: "red",
                    }}
                  >
                    out of stock
                  </Text>
                )}
              </Text>
            }
            key={dishTitle}
            detail={description}
            image={<Image style={{ borderRadius: 5 }} source={source} />}
            contentContainerStyle={{
              height: 50,
              borderColor: "#ccc",
              borderBottomWidth: 2,
            }}
            titleTextStyle={{ color: availability ? "black" : "#666666" }}
            subtitleTextStyle={{ color: availability ? "black" : "#666666" }}
            onPress={() =>
              selectDish({
                title: dishTitle,
                price,
                source,
                description,
                availability,
              })
            }
          />
        )
      )}
    </Section>
  );

  const renderItem = ({ item }) => {
    return (
      <TableView>
        <TableList title={item.title} contents={item.contents} />
      </TableView>
    );
  };

  return (
    <>
      <FlatList
        data={menu}
        renderItem={renderItem}
        keyExtractor={(item) => item.title}
      />
      <ModalPopUp />
    </>
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
      <StatusBar style="auto" />
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
