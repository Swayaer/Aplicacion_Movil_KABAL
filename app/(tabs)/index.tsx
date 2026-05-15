import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useVentas } from '../../context/VentasContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  // Sincronizado con los nuevos nombres del Contexto para evitar errores
  const { 
    usuario, 
    totalVentasDia, 
    gananciaNetaDia, 
    avatar, 
    ventasDia 
  } = useVentas();
  
  const router = useRouter();

  return (
    <LinearGradient 
      colors={['#0f0c29', '#302b63']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Hola,</Text>
            <Text style={styles.brandTitle}>{usuario || "Mi Negocio"}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/perfil')}>
            <Ionicons name={avatar as any} size={50} color="#20d4c5" />
          </TouchableOpacity>
        </View>

        {/* Tarjeta de Ventas: Ahora conectada a la vista diaria */}
        <LinearGradient colors={['#3fe7ec', '#008b7d']} style={styles.mainCard}>
          <View style={styles.row}>
            <Text style={styles.cardLabel}>Hoy</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{ventasDia.length} ventas</Text>
            </View>
          </View>
          
          <Text style={styles.totalValue}>Q{totalVentasDia.toFixed(2)}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.row}>
            <View>
              <Text style={styles.subLabel}>Ganancia Neta (Libre)</Text>
              <Text style={styles.subValue}>Q{gananciaNetaDia.toFixed(2)}</Text>
            </View>
            <Ionicons name="trending-up" size={32} color="rgba(255, 255, 255, 0.7)" />
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Menú Principal</Text>
        
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/venta')}>
            <Ionicons name="cart" size={30} color="#20d4c5" />
            <Text style={styles.menuText}>Nueva Venta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/inventario')}>
            <Ionicons name="cube" size={30} color="#20d4c5" />
            <Text style={styles.menuText}>Inventario</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/reportes')}>
            <Ionicons name="bar-chart" size={30} color="#20d4c5" />
            <Text style={styles.menuText}>Cierre y Reportes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/perfil')}>
            <Ionicons name="settings-outline" size={30} color="#20d4c5" />
            <Text style={styles.menuText}>Configuración</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    paddingTop: 60 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25 
  },
  welcome: { fontSize: 16, color: '#f8f4f4' },
  brandTitle: { fontSize: 24, fontWeight: 'bold', color: '#faf9f9' },
  mainCard: { 
    padding: 25, 
    borderRadius: 25, 
    elevation: 8, 
    shadowColor: '#20d4c5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardLabel: { color: '#fff', fontSize: 20, opacity: 0.9, fontWeight: '600' },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  totalValue: { color: '#fff', fontSize: 42, fontWeight: 'bold', marginVertical: 5 },
  divider: { 
    height: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    marginVertical: 15 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  subLabel: { color: '#fff', fontSize: 14, opacity: 0.8 },
  subValue: { color: '#fff', fontSize: 19, fontWeight: '600' },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#fdf9f9', 
    marginTop: 30, 
    marginBottom: 15 
  },
  menuGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuItem: { 
    backgroundColor: '#fff', 
    width: '48%', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuText: { fontWeight: '600', color: '#444', marginTop: 10 }
});