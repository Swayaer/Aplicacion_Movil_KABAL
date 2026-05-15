import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useVentas } from '../../context/VentasContext';
import { Ionicons } from '@expo/vector-icons';

// Iconos disponibles para tu avatar
const ICONOS = ['person-circle', 'storefront', 'cart', 'restaurant', 'cafe', 'shirt', 'hammer', 'medkit'];

export default function PerfilScreen() {
  const { usuario, setUsuario, regimen, setRegimen, avatar, setAvatar } = useVentas();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Selecciona tu Avatar:</Text>
        <View style={styles.grid}>
          {ICONOS.map((icon) => (
            <TouchableOpacity 
              key={icon} 
              onPress={() => setAvatar(icon)}
              style={[styles.iconCard, avatar === icon && styles.iconActive]}
            >
              <Ionicons name={icon as any} size={32} color={avatar === icon ? 'white' : '#4477c4'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Nombre del Negocio:</Text>
        <TextInput 
          style={styles.input} 
          value={usuario} 
          onChangeText={setUsuario} 
          placeholder="aca coloque el nombre se negocio'"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Régimen (SAT Guatemala):</Text>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.btn, regimen === '5%' && styles.btnActive]} 
            onPress={() => setRegimen('5%')}
          >
            <Text style={regimen === '5%' ? styles.txtActive : {}}>5% Pequeño</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.btn, regimen === '12%' && styles.btnActive]} 
            onPress={() => setRegimen('12%')}
          >
            <Text style={regimen === '12%' ? styles.txtActive : {}}>12% General</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, paddingTop: 60, backgroundColor: '#f8f9fa' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 25 },
  section: { marginBottom: 25 },
  label: { fontSize: 14, color: '#666', marginBottom: 12, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconCard: { padding: 15, backgroundColor: 'white', borderRadius: 15, elevation: 2 },
  iconActive: { backgroundColor: '#00C2B2' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  row: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: 'white', alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  btnActive: { backgroundColor: '#00C2B2', borderColor: '#00C2B2' },
  txtActive: { color: 'white', fontWeight: 'bold' }
});