import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useVentas } from "../../context/VentasContext";

export default function Home() {
  const router = useRouter();
  const { totalVentas } = useVentas();

 return (
  <View style={styles.container}>
    <Text style={styles.title}>StockLy</Text>
    
    {/* Esta es la tarjeta blanca para el total */}
    <View style={styles.totalContainer}>
      <Text style={styles.totalText}>Total Ventas</Text>
      <Text style={styles.totalAmount}>
        ${totalVentas?.toFixed(2) || "0.00"}
      </Text>
    </View>

    {/* Botones */}
    <Button 
      title="Nueva Venta" 
      onPress={() => router.push("/venta")} 
      color="#007AFF" 
    />
    <View style={{ height: 15 }} /> {/* Espacio entre botones */}
    <Button 
      title="Ver Inventario" 
      onPress={() => router.push("/inventario")} 
      color="#34C759" 
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010103', // Fondo gris claro estilo Apple
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6fa8a8',
    marginBottom: 30,
  },
  totalContainer: {
    backgroundColor: '#2dade9',
    padding: 25,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
    // Sombras para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Sombras para Android
    elevation: 5,
  },
  totalText: {
    fontSize: 16,
    color: '#e7e7ee',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: '900',
    color: '#f1f1f1', // Azul llamativo
  },
});
