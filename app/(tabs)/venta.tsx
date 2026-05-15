import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useVentas } from '../../context/VentasContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VentaScreen() {
  const { productos, agregarVenta } = useVentas();
  const [carrito, setCarrito] = useState<any[]>([]);
  
  // Herramientas de navegación para el Escáner
  const router = useRouter();
  const params = useLocalSearchParams();

  const añadirAlCarrito = (item: any) => {
    if (item.stock <= 0) return Alert.alert("Sin Stock", "No hay existencias.");
    const existe = carrito.find(p => p.id === item.id);
    if (existe) {
      setCarrito(carrito.map(p => p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p));
    } else {
      setCarrito([...carrito, { ...item, cantidad: 1 }]);
    }
  };

  // Escuchar si regresamos de la pantalla del escáner con un código
  useEffect(() => {
    if (params.codigoEscaneado) {
      const codigoLeido = params.codigoEscaneado as string;
      
      // Buscamos si el producto existe usando el código de barras
      const productoEncontrado = productos.find((p: any) => p.codigo === codigoLeido);

      if (productoEncontrado) {
        añadirAlCarrito(productoEncontrado);
      } else {
        Alert.alert("Error", "Producto no encontrado en el inventario.");
      }

      // Limpiamos el parámetro para que no se re-agregue en bucle
      router.setParams({ codigoEscaneado: '' });
    }
  }, [params.codigoEscaneado]);

  // Lógica: Elimina unidad por unidad
  const eliminarDelCarrito = (id: string) => {
    const productoEnCarrito = carrito.find(p => p.id === id);
    
    if (productoEnCarrito && productoEnCarrito.cantidad > 1) {
      // Si hay más de uno, restamos 1 a la cantidad
      setCarrito(carrito.map(p => p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p));
    } else {
      // Si solo hay uno, eliminamos el producto por completo
      setCarrito(carrito.filter(p => p.id !== id));
    }
  };

  const finalizarCompra = () => {
    if (carrito.length === 0) return;
    Alert.alert("Confirmar Venta", "¿Finalizar la compra?", [
      { text: "Cancelar" },
      { text: "Vender", onPress: () => {
          carrito.forEach(item => {
            agregarVenta({
              producto: item.nombre,
              precio: item.precio,
              costo: item.costo,
              cantidad: item.cantidad
            });
          });
          setCarrito([]);
          Alert.alert("Éxito", "Venta registrada.");
        }
      }
    ]);
  };

  const totalCarrito = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);

  return (
    <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.container}>
      
      {/* Botón flotante para Escanear (Ubicado arriba a la derecha) */}
      <TouchableOpacity 
        style={styles.fabScanner} 
        onPress={() => router.push({ pathname: '/escaner', params: { origen: 'venta' } })}
      >
        <Ionicons name="barcode-outline" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.listContainer}>
        <Text style={styles.title}>Panel de Ventas</Text>
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.productCard, item.stock <= 0 && { opacity: 0.5 }]} 
              onPress={() => añadirAlCarrito(item)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.price}>Q{item.precio.toFixed(2)}</Text>
              </View>
              <View style={styles.stockInfo}>
                <Text style={styles.stockText}>{item.stock} disp.</Text>
                <Ionicons name="add-circle" size={30} color="#00d2ff" />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay productos en stock.</Text>}
        />
      </View>

      <View style={styles.cartContainer}>
        <View style={styles.cartHeader}>
          <Text style={styles.cartTitle}>Carrito ({carrito.length})</Text>
          <Text style={styles.totalText}>Total: Q{totalCarrito.toFixed(2)}</Text>
        </View>

        <View style={styles.scrollArea}>
          <FlatList
            data={carrito}
            keyExtractor={(item) => item.id + "cart"}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.cartItemName}>{item.cantidad}x {item.nombre}</Text>
                <TouchableOpacity onPress={() => eliminarDelCarrito(item.id)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#ff4d4d" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <TouchableOpacity 
          style={[styles.btnFinalizar, carrito.length === 0 && { backgroundColor: '#ccc' }]} 
          onPress={finalizarCompra}
          disabled={carrito.length === 0}
        >
          <Text style={styles.btnText}>CONFIRMAR Y VENDER</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { flex: 1, padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 90 },
  
  // Estilo para el botón del escáner
  fabScanner: {
    position: 'absolute',
    top: 55,
    right: 25,
    backgroundColor: '#00C2B2',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  productCard: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 15, 
    alignItems: 'center' 
  },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  price: { color: '#00d2ff', fontSize: 14 },
  stockInfo: { alignItems: 'center', flexDirection: 'row' },
  stockText: { color: '#aaa', fontSize: 11, marginRight: 8 },
  emptyText: { color: '#777', textAlign: 'center', marginTop: 40 },

  cartContainer: { 
    backgroundColor: '#fff', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20,
    minHeight: 500,
  },
  cartHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 200
  },
  cartTitle: { fontSize: 25, fontWeight: 'bold', color: '#333' },
  totalText: { fontSize: 20, fontWeight: 'bold', color: '#008b7d' },
  scrollArea: { height: 100, marginBottom: 10 },
  cartItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  cartItemName: { fontSize: 15, color: '#444' },
  btnFinalizar: { 
    backgroundColor: '#0f0c29', 
    padding: 13, 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15}
});