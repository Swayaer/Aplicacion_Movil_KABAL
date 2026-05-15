import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { useVentas } from "../../context/VentasContext";
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function Inventario() {
  const { productos, totalVentasDia, agregarProducto, eliminarProducto, actualizarProducto } = useVentas();
  
  // Herramientas de navegación de Expo Router
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null); 
  
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [costo, setCosto] = useState('');
  const [stock, setStock] = useState('');
  const [codigo, setCodigo] = useState(''); 

  // Escuchar si regresamos de la pantalla del escáner con un código
  useEffect(() => {
    if (params.codigoEscaneado) {
      setCodigo(params.codigoEscaneado as string);
      setModalVisible(true); // Abre el modal automáticamente
    }
  }, [params.codigoEscaneado]);

  const prepararEdicion = (prod: any) => {
    setEditandoId(prod.id);
    setNombre(prod.nombre);
    setPrecio(prod.precio.toString());
    setCosto(prod.costo.toString());
    setStock(prod.stock.toString());
    setCodigo(prod.codigo || ''); 
    setModalVisible(true);
  };

  const guardar = () => {
    if (!nombre || !precio || !stock) {
      Alert.alert("Error", "Por favor completa el nombre, precio y stock.");
      return;
    }

    const datos = {
      nombre, 
      precio: parseFloat(precio), 
      costo: parseFloat(costo) || 0, 
      stock: parseInt(stock),
      codigo 
    };

    if (editandoId) {
      actualizarProducto(editandoId, datos);
    } else {
      agregarProducto(datos);
    }

    // Limpiar y cerrar
    setNombre(''); setPrecio(''); setCosto(''); setStock(''); setCodigo('');
    setEditandoId(null);
    setModalVisible(false);
    
    // Limpiamos los parámetros de la URL para que no se re-abra el modal solo
    router.setParams({ codigoEscaneado: '' });
  };

  const confirmarBorrado = (id: string, nombreProd: string) => {
    Alert.alert("Eliminar Producto", `¿Estás seguro de borrar "${nombreProd}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: () => eliminarProducto(id) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stock</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Ventas de hoy (Caja)</Text>
          <Text style={styles.summaryValue}>Q{totalVentasDia.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Inventario Actual</Text>
      
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.subText}>Venta: Q{item.precio.toFixed(2)} | Costo: Q{item.costo.toFixed(2)}</Text>
              {item.codigo ? <Text style={styles.subText}>Cód: {item.codigo}</Text> : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.stockBadge, { backgroundColor: item.stock < 5 ? '#ff4d4d' : '#00C2B2' }]}>
                <Text style={styles.stockText}>{item.stock} disp.</Text>
              </View>

              <TouchableOpacity onPress={() => prepararEdicion(item)} style={{ marginLeft: 15 }}>
                <Ionicons name="pencil" size={22} color="#007AFF" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => confirmarBorrado(item.id, item.nombre)} style={{ marginLeft: 15 }}>
                <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay productos registrados.</Text>}
      />

      {/* Botón flotante para Escanear con el parámetro de origen agregado */}
      <TouchableOpacity 
        style={[styles.fab, { right: 100, backgroundColor: '#0f0c29' }]} 
        onPress={() => router.push({ pathname: '/escaner', params: { origen: 'inventario' } })}
      >
        <Ionicons name="barcode-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Botón flotante para Agregar manual */}
      <TouchableOpacity style={styles.fab} onPress={() => { setEditandoId(null); setModalVisible(true); }}>
        <Ionicons name="add" size={35} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalCentered}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{editandoId ? "Editar Producto" : "Nuevo Producto"}</Text>
            
            <TextInput placeholder="Código de barras (Opcional)" placeholderTextColor="#888" style={styles.input} value={codigo} onChangeText={setCodigo} />
            <TextInput placeholder="Nombre del producto" placeholderTextColor="#888" style={styles.input} value={nombre} onChangeText={setNombre} />
            <TextInput placeholder="Precio Venta" placeholderTextColor="#888" style={styles.input} keyboardType="numeric" value={precio} onChangeText={setPrecio} />
            <TextInput placeholder="Costo Compra" placeholderTextColor="#888" style={styles.input} keyboardType="numeric" value={costo} onChangeText={setCosto} />
            <TextInput placeholder="Stock Actual" placeholderTextColor="#888" style={styles.input} keyboardType="numeric" value={stock} onChangeText={setStock} />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, {backgroundColor: '#eee'}]} onPress={() => { setModalVisible(false); setEditandoId(null); setCodigo(''); }}>
                <Text>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, {backgroundColor: '#00C2B2'}]} onPress={guardar}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fafafa', paddingTop: 40 },
  header: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold' },
  summaryCard: { backgroundColor: '#00C2B2', padding: 20, borderRadius: 15, marginTop: 10 },
  summaryLabel: { color: '#fff', fontSize: 16 },
  summaryValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  item: { backgroundColor: '#fff', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, elevation: 2 },
  nombre: { fontSize: 18, fontWeight: '600', color: '#000' },
  subText: { color: '#666', fontSize: 13 },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  stockText: { color: '#fff', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 25, bottom: 90, backgroundColor: '#007AFF', width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 8, color: '#000' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { padding: 15, borderRadius: 10, width: '48%', alignItems: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 }
});