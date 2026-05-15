import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams, Href } from 'expo-router';

export default function LectorCodigoBarras() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // NUEVO: Leemos de dónde venimos
  const origen = params.origen as string;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.textoPermiso}>
          Necesitamos tu permiso para usar la cámara en Kabal
        </Text>
        <Button onPress={requestPermission} title="Otorgar Permiso" />
      </View>
    );
  }

  // MODIFICADO: Enviamos el código a la pantalla correcta
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    // Decidimos la ruta destino basada en el parámetro 'origen'
    const rutaDestino = (origen === 'venta' ? '/venta' : '/inventario') as Href;
    
    // Usamos replace en lugar de push para que no se apilen pantallas de cámara en el historial
    router.replace({
      pathname: rutaDestino,
      params: { codigoEscaneado: data }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Escanea el código del producto</Text>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "upc_e", "upc_a"],
          }}
        />
      </View>

      {scanned && (
        <View style={styles.botones}>
          <Button title="Escanear de nuevo" onPress={() => setScanned(false)} />
        </View>
      )}

      <View style={styles.botones}>
        <Button title="Volver atrás" onPress={() => router.back()} color="#ff4444" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  textoPermiso: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  cameraContainer: {
    height: 400,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  botones: {
    marginTop: 10,
  }
});