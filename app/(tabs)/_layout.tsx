import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f0c29',
          height: 60,
          paddingBottom: 10,
          position: 'absolute',
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#00d2ff',
        tabBarInactiveTintColor: '#edf3f5',
      }}
    >
      <Tabs.Screen
        name="index" 
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="venta"
        options={{
          title: 'Ventas',
          tabBarIcon: ({ color }) => <Ionicons name="cart-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventario"
        options={{
          title: 'Stock',
          tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reportes"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color }) => <Ionicons name="bar-chart-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
      
      {/* 👇 PANTALLA DEL ESCÁNER OCULTA DE LA BARRA INFERIOR 👇 */}
      <Tabs.Screen
        name="escaner"
        options={{
          href: null, // Esto es la magia: la oculta de las pestañas
          title: 'Escanear Producto'
        }}
      />
    </Tabs>
  );
}