import { loginPost } from "@/services/users";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (username === "" || password === "") {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    setLoading(true);
    try {
      const response = await loginPost(username, password);
      if (response.data.user.name) {
        router.replace("/(app)/(tabs)");
      }
    } catch {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  // setApiResponse(response.data.user.name);

  return {
    username,
    setUsername,
    password,
    setPassword,
    apiResponse,
    loading,
    handleLogin,
  };
};
