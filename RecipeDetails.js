import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RecipeDetails({ route, favorites, toggleFavorite }) {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchRecipeDetail = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await res.json();
        if (mounted) setRecipe(data.meals ? data.meals[0] : null);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchRecipeDetail();
    return () => (mounted = false);
  }, [recipeId]);

  if (loading) return <ActivityIndicator size="large" color="#ff69b4" style={{ flex: 1 }} />;
  if (!recipe) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>No se encontró la receta</Text></View>;

  const isFavorite = favorites.some((f) => f.idMeal === recipe.idMeal);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.appTitle}>Cookly</Text>

      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.strMealThumb }} style={styles.image} resizeMode="cover" />
          <TouchableOpacity style={styles.heartIcon} onPress={() => toggleFavorite(recipe)}>
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#ffb6c1" : "black"} />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{recipe.strMeal}</Text>
        <Text style={styles.category}>Categoría: {recipe.strCategory}</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Ingredientes</Text>
          {Array.from({ length: 20 }, (_, i) => {
            const ingredient = recipe[`strIngredient${i + 1}`];
            const measure = recipe[`strMeasure${i + 1}`];
            if (ingredient && ingredient.trim() !== "") {
              return (
                <Text key={i} style={styles.text}>
                  🍴 {measure} {ingredient}
                </Text>
              );
            }
            return null;
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Instrucciones</Text>
          <Text style={styles.text}>{recipe.strInstructions}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff0f5" },
  appTitle: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginTop: 30, marginBottom: 15, color: "#ff69b4" },
  card: { backgroundColor: "white", borderRadius: 15, padding: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5, marginBottom: 20 },
  imageContainer: { position: "relative" },
  image: { width: "100%", height: 250, borderRadius: 15 },
  heartIcon: { position: "absolute", top: 10, right: 10, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 20, padding: 5 },
  title: { fontSize: 22, fontWeight: "bold", color: "#ff69b4", textAlign: "center", marginVertical: 5 },
  category: { fontSize: 16, color: "black", textAlign: "center", marginBottom: 15 },
  section: { marginTop: 15 },
  subtitle: { fontSize: 18, fontWeight: "bold", color: "#ff69b4", marginBottom: 10 },
  text: { fontSize: 14, marginTop: 5, lineHeight: 20 },
});
