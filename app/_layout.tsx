import { VentasProvider } from "../context/VentasContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <VentasProvider>
      <Stack>
        {/* El nombre "(tabs)" debe coincidir con el nombre de tu carpeta */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </VentasProvider>
  );
}