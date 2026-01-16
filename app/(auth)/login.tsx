import { fetchHelloData } from "@/services/test";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      router.replace("/(app)/(tabs)");
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  };

  const handleCallApi = async () => {
    setLoading(true);
    try {
      const response = await fetchHelloData();
      setApiResponse(response);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar a la API");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Inicio de Sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario..."
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#999"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </Pressable>


        <Pressable
          style={styles.apiButton}
          onPress={handleCallApi}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Llamar API</Text>
          )}
        </Pressable>

        {apiResponse && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>Respuesta de API:</Text>
            <Text style={styles.responseText}>
              {JSON.stringify(apiResponse, null, 2)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
    color: "#000",
  },
  button: {
    width: "100%",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  apiButton: {
    width: "100%",
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  responseContainer: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  responseTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  responseText: {
    fontSize: 12,
    color: "#333",
    fontFamily: "monospace",
  },
});
