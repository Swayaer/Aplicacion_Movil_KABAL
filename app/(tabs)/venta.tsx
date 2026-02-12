import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useVentas } from '../../context/VentasContext';
import { Ionicons } from '@expo/vector-icons';

export default function VentaScreen() {
  const { productos, agregarVenta } = useVentas();
  const [carrito, setCarrito] = useState<{ nombre: string; precio: number; id: string }[]>([]);

  const seleccionarProducto = (prod: any) => {
    if (prod.stock <= 0) {
      Alert.alert("Sin Stock", `Ya no quedan unidades de ${prod.nombre}`);
      return;
    }
    // Agregamos al carrito con un ID único para poder borrarlo individualmente
    setCarrito([...carrito, { nombre: prod.nombre, precio: prod.precio, id: Date.now().toString() + Math.random() }]);
  };

  // --- FUNCIÓN PARA ELIMINAR DEL CARRITO ---
  const eliminarDelCarrito = (id: string) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const finalizarVenta = () => {
    if (carrito.length === 0) return;

    // Registramos cada producto en el historial y descontamos stock
    carrito.forEach(item => {
      agregarVenta({ producto: item.nombre, precio: item.precio });
    });

    Alert.alert("¡Venta Exitosa!", `Se registraron Q${totalCarrito.toFixed(2)} correctamente.`);
    setCarrito([]);
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Venta</Text>

      <Text style={styles.subtitle}>Selecciona los productos:</Text>
      <View style={{ height: 160 }}>
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.prodCard, { opacity: item.stock <= 0 ? 0.5 : 1 }]} 
              onPress={() => seleccionarProducto(item)}
            >
              <Ionicons name="cube-outline" size={30} color="#00C2B2" />
              <Text style={styles.prodName}>{item.nombre}</Text>
              <Text style={styles.prodPrice}>Q{item.precio.toFixed(2)}</Text>
              <Text style={styles.prodStock}>{item.stock} disp.</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.cartContainer}>
        <Text style={styles.cartTitle}>Detalle de Venta ({carrito.length})</Text>
        <FlatList
          data={carrito}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View>
                <Text style={styles.cartItemName}>{item.nombre}</Text>
                <Text style={styles.cartItemPrice}>Q{item.precio.toFixed(2)}</Text>
              </View>
              {/* BOTÓN ELIMINAR */}
              <TouchableOpacity onPress={() => eliminarDelCarrito(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          )}
        />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>Q{totalCarrito.toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.btnCobrar, { backgroundColor: carrito.length > 0 ? '#007AFF' : '#ccc' }]} 
          onPress={finalizarVenta}
          disabled={carrito.length === 0}
        >
          <Text style={styles.btnText}>REGISTRAR VENTA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 15 },
  prodCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginRight: 10, width: 120, alignItems: 'center', elevation: 3 },
  prodName: { fontWeight: 'bold', marginTop: 5, textAlign: 'center' },
  prodPrice: { color: '#00C2B2', fontWeight: 'bold' },
  prodStock: { fontSize: 10, color: '#888' },
  cartContainer: { flex: 1, marginTop: 20, backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 5 },
  cartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 10 },
  cartItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f9f9f9' },
  cartItemName: { fontSize: 15, fontWeight: '500' },
  cartItemPrice: { fontSize: 13, color: '#666' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 10, borderTopWidth: 2, borderColor: '#eee' },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  btnCobrar: { marginTop: 15, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});