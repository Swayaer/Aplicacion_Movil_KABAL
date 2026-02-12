import React, { createContext, useContext, useState } from 'react';

type Producto = {
  id: string;
  nombre: string;
  precio: number;
  costo: number;
  stock: number;
};

type Venta = {
  producto: string;
  precio: number;
};

type VentasContextType = {
  ventas: Venta[];
  productos: Producto[];
  agregarVenta: (venta: Venta) => void;
  agregarProducto: (prod: Omit<Producto, 'id'>) => void;
  totalVentas: number;
};

const VentasContext = createContext<VentasContextType | undefined>(undefined);

export const VentasProvider = ({ children }: { children: React.ReactNode }) => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([
    { id: '1', nombre: 'Agua Pura', precio: 5, costo: 3, stock: 20 },
    { id: '2', nombre: 'Soda', precio: 10, costo: 6, stock: 15 },
  ]);

  const agregarVenta = (venta: Venta) => {
    setVentas((prev) => [...prev, venta]);
    setProductos((prevProd) =>
      prevProd.map((p) =>
        p.nombre === venta.producto ? { ...p, stock: p.stock - 1 } : p
      )
    );
  };

  const agregarProducto = (nuevoProd: Omit<Producto, 'id'>) => {
    setProductos((prev) => [...prev, { ...nuevoProd, id: Date.now().toString() }]);
  };

  const totalVentas = ventas.reduce((acc, venta) => acc + venta.precio, 0);

  return (
    <VentasContext.Provider value={{ ventas, productos, agregarVenta, agregarProducto, totalVentas }}>
      {children}
    </VentasContext.Provider>
  );
};

export const useVentas = () => {
  const context = useContext(VentasContext);
  if (!context) throw new Error('useVentas debe usarse dentro de VentasProvider');
  return context;
};