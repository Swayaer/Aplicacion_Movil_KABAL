import React, { createContext, useContext, useState } from 'react';

type Venta = {
  producto: string;
  precio: number;
};

type VentasContextType = {
  ventas: Venta[];
  agregarVenta: (venta: Venta) => void;
  totalVentas: number;
};

const VentasContext = createContext<VentasContextType | undefined>(undefined);

export const VentasProvider = ({ children }: { children: React.ReactNode }) => {
  const [ventas, setVentas] = useState<Venta[]>([]);

  const agregarVenta = (venta: Venta) => {
    setVentas((prev) => [...prev, venta]);
  };

  const totalVentas = ventas.reduce((acc, venta) => acc + venta.precio, 0);

  return (
    <VentasContext.Provider value={{ ventas, agregarVenta, totalVentas }}>
      {children}
    </VentasContext.Provider>
  );
};

export const useVentas = () => {
  const context = useContext(VentasContext);
  if (!context) {
    throw new Error('useVentas debe usarse dentro de VentasProvider');
  }
  return context;
};
