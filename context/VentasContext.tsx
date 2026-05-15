import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type Producto = { id: string; nombre: string; precio: number; costo: number; stock: number; };
type Venta = { id: string; producto: string; precio: number; costo: number; cantidad: number; fecha: string; };

type VentasContextType = {
  ventasDia: Venta[];
  historialCompleto: any[];
  productos: Producto[];
  usuario: string;
  regimen: '5%' | '12%';
  avatar: string;
  esPro: boolean; 
  activarPro: (codigo: string) => void;
  setUsuario: (nombre: string) => void;
  setRegimen: (r: '5%' | '12%') => void;
  setAvatar: (icon: string) => void;
  agregarVenta: (venta: { producto: string; precio: number; costo: number; cantidad: number }) => void;
  agregarProducto: (prod: Omit<Producto, 'id'>) => void;
  eliminarProducto: (id: string) => void;
  actualizarProducto: (id: string, datos: Partial<Omit<Producto, 'id'>>) => void; // NUEVA FUNCIÓN
  finalizarDia: () => void;
  borrarTodoElHistorial: () => void;
  totalVentasDia: number;
  gananciaBrutaDia: number;
  impuestosDia: number;
  gananciaNetaDia: number;
};

const VentasContext = createContext<VentasContextType | undefined>(undefined);

export const VentasProvider = ({ children }: { children: React.ReactNode }) => {
  const [ventasDia, setVentasDia] = useState<Venta[]>([]);
  const [historialCompleto, setHistorialCompleto] = useState<any[]>([]);
  const [usuario, setUsuario] = useState('Mi Negocio');
  const [regimen, setRegimen] = useState<'5%' | '12%'>('5%');
  const [avatar, setAvatar] = useState('person-circle');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [esPro, setEsPro] = useState(false);

  // Cálculos automáticos
  const totalVentasDia = ventasDia.reduce((acc, v) => acc + v.precio, 0);
  const gananciaBrutaDia = ventasDia.reduce((acc, v) => acc + (v.precio - v.costo), 0);
  const impuestosDia = totalVentasDia * (regimen === '5%' ? 0.05 : 0.12);
  const gananciaNetaDia = gananciaBrutaDia - impuestosDia;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [hist, prods, name, pro, reg, av] = await Promise.all([
          AsyncStorage.getItem('@bitacora_total'),
          AsyncStorage.getItem('@inventario'),
          AsyncStorage.getItem('@usuario_nombre'),
          AsyncStorage.getItem('@estado_pro'),
          AsyncStorage.getItem('@regimen'),
          AsyncStorage.getItem('@avatar')
        ]);
        if (hist) setHistorialCompleto(JSON.parse(hist));
        if (prods) setProductos(JSON.parse(prods));
        if (name) setUsuario(name);
        if (reg) setRegimen(reg as '5%' | '12%');
        if (av) setAvatar(av);
        if (pro === 'activo') setEsPro(true);
      } catch (e) { console.error(e); }
    };
    cargarDatos();
  }, []);

  const activarPro = async (codigo: string) => {
    const LLAVE_MAESTRA = "STOCKLY-2026-VIP";
    if (codigo === LLAVE_MAESTRA) {
      setEsPro(true);
      await AsyncStorage.setItem('@estado_pro', 'activo');
      Alert.alert("¡Éxito!", "Has desbloqueado las funciones Pro.");
    } else {
      Alert.alert("Error", "Llave incorrecta.");
    }
  };

  const agregarVenta = async (datos: any) => {
    const nueva: Venta = { 
      id: Date.now().toString(), 
      ...datos, 
      precio: datos.precio * datos.cantidad,
      costo: datos.costo * datos.cantidad,
      fecha: new Date().toLocaleString('es-GT') 
    };
    const nuevasVentas = [...ventasDia, nueva];
    setVentasDia(nuevasVentas);
    const nuevosProds = productos.map(p => p.nombre === datos.producto ? { ...p, stock: p.stock - datos.cantidad } : p);
    setProductos(nuevosProds);
    await AsyncStorage.setItem('@inventario', JSON.stringify(nuevosProds));
  };

  const finalizarDia = async () => {
    if (ventasDia.length === 0) return;
    const nuevoHist = [...historialCompleto, { id: Date.now().toString(), fecha: new Date().toLocaleDateString('es-GT'), total: totalVentasDia, ganancia: gananciaNetaDia, detalle: ventasDia }];
    setHistorialCompleto(nuevoHist);
    setVentasDia([]);
    await AsyncStorage.setItem('@bitacora_total', JSON.stringify(nuevoHist));
    Alert.alert("Cierre Guardado", "Se ha archivado el día.");
  };

  const agregarProducto = async (p: any) => {
    const nuevos = [...productos, { ...p, id: Date.now().toString() }];
    setProductos(nuevos);
    await AsyncStorage.setItem('@inventario', JSON.stringify(nuevos));
  };

  const eliminarProducto = async (id: string) => {
    Alert.alert("Eliminar", "¿Seguro que quieres borrar este producto?", [
      { text: "No" },
      { text: "Sí, Eliminar", onPress: async () => {
          const filtrados = productos.filter(p => p.id !== id);
          setProductos(filtrados);
          await AsyncStorage.setItem('@inventario', JSON.stringify(filtrados));
      }}
    ]);
  };

  // --- FUNCIÓN PARA EDITAR Y REABASTECER ---
  const actualizarProducto = async (id: string, nuevosDatos: any) => {
    const actualizados = productos.map(p => p.id === id ? { ...p, ...nuevosDatos } : p);
    setProductos(actualizados);
    await AsyncStorage.setItem('@inventario', JSON.stringify(actualizados));
  };

  const setUsuarioPersist = async (n: string) => { setUsuario(n); await AsyncStorage.setItem('@usuario_nombre', n); };
  const setRegimenPersist = async (r: '5%' | '12%') => { setRegimen(r); await AsyncStorage.setItem('@regimen', r); };
  const setAvatarPersist = async (a: string) => { setAvatar(a); await AsyncStorage.setItem('@avatar', a); };
  const borrarTodoElHistorial = async () => { setHistorialCompleto([]); await AsyncStorage.removeItem('@bitacora_total'); };

  return (
    <VentasContext.Provider value={{ 
      ventasDia, historialCompleto, productos, usuario, regimen, avatar, esPro, activarPro, 
      setUsuario: setUsuarioPersist, setRegimen: setRegimenPersist, setAvatar: setAvatarPersist, 
      agregarVenta, agregarProducto, eliminarProducto, actualizarProducto, finalizarDia, borrarTodoElHistorial,
      totalVentasDia, gananciaBrutaDia, impuestosDia, gananciaNetaDia 
    }}>
      {children}
    </VentasContext.Provider>
  );
};

export const useVentas = () => {
  const context = useContext(VentasContext);
  if (!context) throw new Error('useVentas error');
  return context;
};