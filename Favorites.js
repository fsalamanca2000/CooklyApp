import React from "react";
import {View,Text,FlatList,TouchableOpacity,Image,StyleSheet,} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Favorites({ favorites, toggleFavorite, navigation }) {
  return (
    <View style={styles.container}>
      {/* Título de la app */}
      <Text style={styles.appTitle}>Cookly</Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>Mis recetas favoritas</Text>

      {/* Lista de favoritos */}
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No tienes recetas en favoritos aún</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.strMealThumb }} style={styles.image} />
              <Text style={styles.title}>{item.strMeal}</Text>

              {/* Botón corazón */}
              <TouchableOpacity
                style={styles.heartButton}
                onPress={() => toggleFavorite(item)}
              >
                <Ionicons
                  name={
                    favorites.some((f) => f.idMeal === item.idMeal)
                      ? "heart"
                      : "heart-outline"
                  }
                  size={22}
                  color={
                    favorites.some((f) => f.idMeal === item.idMeal)
                      ? "#ffb6c1"
                      : "black"
                  }
                />
              </TouchableOpacity>

              {/* Botón + detalles */}
              <TouchableOpacity
                onPress={() =>
                navigation.navigate("Inicio", {
                screen: "RecipeDetails",
                params: { recipeId: item.idMeal },
                })
                }
                >
                <Text style={styles.detailsButton}>+ Detalles</Text>
                </TouchableOpacity>

            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f5", // 🎨 pastel de fondo
    padding: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30, // 👈 espacio para cámara
    marginBottom: 10,
    color: "#ff69b4",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "black",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#f9f9f9", // 🎨 tarjetas suaves
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  heartButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  detailsButton: {
    fontSize: 12,
    color: "#ff69b4",
    marginTop: 5,
    fontWeight: "bold",
  },
});
