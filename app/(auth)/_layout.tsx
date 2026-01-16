import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#45eb17",
        }}
      />
    </Stack>
  );
}
