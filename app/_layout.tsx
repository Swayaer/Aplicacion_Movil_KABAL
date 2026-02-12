import { VentasProvider } from "../context/VentasContext"; // Verifica la ruta
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <VentasProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </VentasProvider>
  );
}