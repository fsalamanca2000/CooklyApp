import React, { useState } from "react";
import {View,Text,SafeAreaView,StyleSheet,Image,TextInput,TouchableOpacity,Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  // Estados iniciales
  const [name, setName] = useState("Juan");
  const [lastName, setLastName] = useState("Pérez");
  const [country, setCountry] = useState("Colombia");

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Perfil actualizado", `✅ Cambios guardados con éxito`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.appTitle}>Mi Perfil</Text>

        {/* Foto genérica */}
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
          style={styles.profileImage}
        />

        {/* Nombre de usuario */}
        <Text style={styles.userName}>Usuario Genérico</Text>

        {/* Botón editar */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editText}>
            {isEditing ? "Cancelar" : "Editar"}
          </Text>
        </TouchableOpacity>

        {/* Datos personales */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Nombre:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          ) : (
            <Text style={styles.info}>{name}</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Apellido:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          ) : (
            <Text style={styles.info}>{lastName}</Text>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>País:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
            />
          ) : (
            <Text style={styles.info}>{country}</Text>
          )}
        </View>

        {/* Botón guardar solo si está en edición */}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff0f5",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
    color: "#ff69b4",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff69b4",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  editText: {
    color: "#fff",
    marginLeft: 5,
    fontWeight: "bold",
  },
  infoBox: {
    width: "90%",
    marginBottom: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#ff69b4",
    marginBottom: 3,
  },
  info: {
    fontSize: 16,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    fontSize: 16,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffb6c1",
  },
  saveButton: {
    backgroundColor: "#ff69b4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
