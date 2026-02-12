import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { useVentas } from "../../context/VentasContext";

export default function Venta() {
  const [producto, setProducto] = useState("");
  const [precio, setPrecio] = useState("");

  const { agregarVenta } = useVentas();

  const guardarVenta = () => {
    if (!producto || !precio) return;

    agregarVenta({
      producto,
      precio: parseFloat(precio),
    });

    setProducto("");
    setPrecio("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Venta</Text>

      <TextInput
        placeholder="Producto"
        value={producto}
        onChangeText={setProducto}
        style={styles.input}
      />

      <TextInput
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Guardar Venta" onPress={guardarVenta} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
