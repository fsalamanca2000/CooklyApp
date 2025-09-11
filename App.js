import React, { useEffect, useState } from "react";
import {View,Text,FlatList,Image,TouchableOpacity,StyleSheet,TextInput,SafeAreaView,} from "react-native";
import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RecipeDetails from "./RecipeDetails";
import Favorites from "./Favorites";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  // ahora favorites guarda objetos de receta completos
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const toggleFavorite = (recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((r) => r.idMeal === recipe.idMeal);
      if (exists) return prev.filter((r) => r.idMeal !== recipe.idMeal);
      return [recipe, ...prev];
    });
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#ffb6c1",
          tabBarStyle: { backgroundColor: "#fff" },
        }}
      >
        {/* Inicio: le pasamos estado y toggle */}
        <Tab.Screen
          name="Inicio"
          children={() => (
            <HomeStack
              favorites={favorites}
              recipes={recipes}
              setRecipes={setRecipes}
              toggleFavorite={toggleFavorite}
            />
          )}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Favoritos recibe favorites como array de objetos */}
        <Tab.Screen
          name="Favoritos"
          children={({ navigation }) => (
            <Favorites
              navigation={navigation}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/* ------------------- Home & Stack ------------------- */

function HomeScreen({ navigation, favorites, recipes, setRecipes, toggleFavorite }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // categorías
  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/categories.php")
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.log(err));
  }, []);

  // recetas base
  useEffect(() => {
    axios
      .get("https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken")
      .then((res) => setRecipes(res.data.meals || []))
      .catch((err) => console.log(err));
  }, [setRecipes]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    axios
      .get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then((res) => setRecipes(res.data.meals || []))
      .catch((err) => console.log(err));
  };

  // búsqueda
  useEffect(() => {
    if (search.length > 0) {
      axios
        .get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
        .then((res) => setSearchResults(res.data.meals || []))
        .catch((err) => console.log(err));
    } else {
      setSearchResults([]);
    }
  }, [search]);

  //Saber si una receta está en favoritos
  const isFav = (id) => favorites.some((f) => f.idMeal === id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appTitle}>Cookly</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar receta..."
          value={search}
          onChangeText={setSearch}
        />

        {search.length > 0 && (
          <View style={styles.searchResults}>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.idMeal}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.searchItem}
                  onPress={() => navigation.navigate("RecipeDetails", { recipeId: item.idMeal })}
                >
                  <Image source={{ uri: item.strMealThumb }} style={styles.searchImage} />
                  <Text style={styles.searchText}>{item.strMeal}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <View style={styles.categoriesWrapper}>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.idCategory}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.categoryContainer} onPress={() => handleCategoryPress(item.strCategory)}>
                <Image source={{ uri: item.strCategoryThumb }} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.strCategory}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {selectedCategory && <Text style={styles.categoryTitle}>{selectedCategory}</Text>}

        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeText} numberOfLines={1}>
                  {item.strMeal}
                </Text>
                <View style={styles.recipeButtons}>
                  <TouchableOpacity onPress={() => toggleFavorite(item)}>
                    <Ionicons
                      name={isFav(item.idMeal) ? "heart" : "heart-outline"}
                      size={22}
                      color={isFav(item.idMeal) ? "#ffb6c1" : "black"}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate("RecipeDetails", { recipeId: item.idMeal })}>
                    <Text style={styles.detailsButton}>+ Detalles</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </SafeAreaView>
  );
}

function HomeStack({ favorites, recipes, setRecipes, toggleFavorite }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        children={({ navigation }) => (
          <HomeScreen
            navigation={navigation}
            favorites={favorites}
            recipes={recipes}
            setRecipes={setRecipes}
            toggleFavorite={toggleFavorite}
          />
        )}
      />
      <Stack.Screen
        name="RecipeDetails"
        children={(props) => <RecipeDetails {...props} favorites={favorites} toggleFavorite={toggleFavorite} />}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff0f5" },
  container: { flex: 1, paddingHorizontal: 10, backgroundColor: "#fff0f5" },
  appTitle: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 10, marginTop: 30, color: "#ff69b4" },
  searchInput: { backgroundColor: "#fff", padding: 8, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ffb6c1" },
  searchResults: { position: "absolute", top: 100, left: 10, right: 10, backgroundColor: "#fff", borderRadius: 10, maxHeight: 250, zIndex: 10, borderWidth: 1, borderColor: "#ddd" },
  searchItem: { flexDirection: "row", alignItems: "center", padding: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  searchImage: { width: 40, height: 40, borderRadius: 5, marginRight: 10 },
  searchText: { fontSize: 14, flex: 1 },
  categoriesWrapper: { height: 120, justifyContent: "center", marginBottom: 10 },
  categoryContainer: { alignItems: "center", marginHorizontal: 10 },
  categoryImage: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: "#ffb6c1" },
  categoryText: { fontSize: 12, marginTop: 5, textAlign: "center", width: 80 },
  categoryTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10, textAlign: "center", color: "#ff69b4" },
  gridContainer: { paddingBottom: 60, justifyContent: "center", alignItems: "center" },
  recipeCard: { width: 160, margin: 8, backgroundColor: "#fff", borderRadius: 10, padding: 5, alignItems: "center", elevation: 2 },
  recipeImage: { width: 140, height: 100, borderRadius: 10 },
  recipeInfo: { marginTop: 5, alignItems: "center" },
  recipeText: { fontSize: 14, fontWeight: "bold", textAlign: "center", maxWidth: 120 },
  recipeButtons: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 5 },
  detailsButton: { fontSize: 12, color: "#ff69b4", fontWeight: "bold" },
});
