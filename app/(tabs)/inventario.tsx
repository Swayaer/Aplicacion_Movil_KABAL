import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native";
import { useVentas } from "../../context/VentasContext";
import { Ionicons } from '@expo/vector-icons';

export default function Inventario() {
  const { productos, totalVentas, agregarProducto } = useVentas();
  
  // Estados para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [costo, setCosto] = useState('');
  const [stock, setStock] = useState('');

  const guardarProducto = () => {
    if (!nombre || !precio || !stock) return;
    agregarProducto({
      nombre,
      precio: parseFloat(precio),
      costo: parseFloat(costo) || 0,
      stock: parseInt(stock)
    });
    setNombre(''); setPrecio(''); setCosto(''); setStock('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>StockLy</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Ventas de hoy</Text>
          <Text style={styles.summaryValue}>Q{totalVentas.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Inventario Actual</Text>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.subText}>Venta: Q{item.precio} | Costo: Q{item.costo}</Text>
            </View>
            <View style={[styles.stockBadge, { backgroundColor: item.stock < 5 ? '#ff4d4d' : '#00C2B2' }]}>
              <Text style={styles.stockText}>{item.stock} disp.</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalCentered}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nuevo Producto</Text>
            <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
            <TextInput placeholder="Precio Venta (Q)" style={styles.input} keyboardType="numeric" value={precio} onChangeText={setPrecio} />
            <TextInput placeholder="Costo (Q)" style={styles.input} keyboardType="numeric" value={costo} onChangeText={setCosto} />
            <TextInput placeholder="Stock Inicial" style={styles.input} keyboardType="numeric" value={stock} onChangeText={setStock} />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={guardarProducto}>
                <Text style={styles.btnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  header: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1a1a1a' },
  summaryCard: { backgroundColor: '#00C2B2', padding: 20, borderRadius: 15, marginTop: 15, elevation: 4 },
  summaryLabel: { color: '#fff', fontSize: 16 },
  summaryValue: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 15, color: '#444' },
  item: { backgroundColor: '#fff', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, elevation: 2 },
  nombre: { fontSize: 18, fontWeight: '600' },
  subText: { color: '#888', fontSize: 13 },
  stockBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  stockText: { color: '#fff', fontWeight: 'bold' },
  fab: { position: 'absolute', right: 30, bottom: 30, backgroundColor: '#007AFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8, zIndex: 999 },
  modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 25, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 8, fontSize: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { padding: 12, borderRadius: 10, width: '45%', alignItems: 'center' },
  btnCancel: { backgroundColor: '#ff4d4d' },
  btnSave: { backgroundColor: '#00C2B2' },
  btnText: { color: 'white', fontWeight: 'bold' }
});