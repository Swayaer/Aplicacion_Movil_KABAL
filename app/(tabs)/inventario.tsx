import { View, Text, FlatList, StyleSheet } from "react-native";
import { useVentas } from "../../context/VentasContext";

export default function Inventario() {
  const { ventas } = useVentas();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Ventas</Text>

      <FlatList
        data={ventas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.producto}</Text>
            <Text>${item.precio}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
});
