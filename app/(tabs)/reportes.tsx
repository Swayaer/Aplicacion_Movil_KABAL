import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Modal, TextInput } from 'react-native';
import { useVentas } from '../../context/VentasContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ReportesScreen() {
  const { 
    ventasDia, totalVentasDia, impuestosDia, gananciaNetaDia, 
    usuario, finalizarDia, historialCompleto, esPro, activarPro 
  } = useVentas();

  const [modalProVisible, setModalProVisible] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState('');

  const manejarActivacion = () => {
    activarPro(codigoIngresado.trim());
    setCodigoIngresado('');
    setModalProVisible(false);
  };

  const generarPDF = async (titulo: string, datosVentas: any[], total: number, neta: number) => {
   
    const ventasAgrupadas = datosVentas.reduce((acc: any, actual: any) => {
      const existe = acc.find((item: any) => item.producto === actual.producto);
      if (existe) {
        existe.cantidad += actual.cantidad;
        existe.subtotal += (actual.precio * actual.cantidad);
      } else {
        acc.push({ 
          producto: actual.producto, 
          cantidad: actual.cantidad, 
          precio: actual.precio,
          subtotal: actual.precio * actual.cantidad 
        });
      }
      return acc;
    }, []);

    const html = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 3px solid #00d2ff; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .brand { color: #0f0c29; font-size: 28px; font-weight: bold; margin: 0; }
            .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #0f0c29; color: white; text-align: left; padding: 12px; }
            td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            
            .summary-container { margin-top: 40px; padding: 25px; background-color: #f0fbff; border-radius: 15px; text-align: right; border: 1px solid #00d2ff; }
            .total-label { font-size: 16px; color: #666; margin: 0; }
            .net-label { font-size: 18px; color: #0f0c29; font-weight: bold; margin-top: 10px; }
            .net-amount { font-size: 36px; font-weight: bold; color: #008b7d; margin: 0; }
            
            .footer { margin-top: 60px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
            .legal { font-style: italic; font-size: 10px; color: #bbb; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <p class="brand">KABAL</p>
              <p class="subtitle">Reporte de Negocio: ${usuario}</p>
            </div>
            <div style="text-align: right">
              <p style="margin:0; font-weight: bold;">${titulo}</p>
              <p style="margin:0; font-size: 12px;">Fecha: ${new Date().toLocaleDateString('es-GT')}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Descripción del Producto</th>
                <th>Cant.</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${ventasAgrupadas.map((item: any) => `
                <tr>
                  <td>${item.producto}</td>
                  <td>${item.cantidad}</td>
                  <td>Q${item.precio.toFixed(2)}</td>
                  <td>Q${item.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-container">
            <p class="total-label">Ventas Brutas: Q${total.toFixed(2)}</p>
            <p class="net-label">GANANCIA NETA FINAL</p>
            <p class="net-amount">Q${neta.toFixed(2)}</p>
          </div>

          <div class="footer">
            <p><strong>Powered by Kabal</strong> - Gestión Inteligente para Emprendedores</p>
            <p class="legal">Aviso: Este documento es un informe administrativo interno. No tiene validez legal como factura o comprobante tributario oficial.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "No se pudo generar el reporte.");
    }
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        <Text style={styles.title}>Cierre de Caja</Text>
        
        <View style={styles.resumenCard}>
          <View style={styles.headerRow}>
            <Text style={styles.resumenTitulo}>Balance Hoy</Text>
            <TouchableOpacity 
              onPress={() => generarPDF("Cierre Diario", ventasDia, totalVentasDia, gananciaNetaDia)} 
              style={styles.pdfBtn}
              disabled={ventasDia.length === 0}
            >
              <Ionicons name="document-text" size={18} color="#00d2ff" />
              <Text style={styles.pdfBtnText}> EXPORTAR PDF</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filaResumen}><Text style={styles.label}>Ventas Brutas:</Text><Text style={styles.valor}>Q{totalVentasDia.toFixed(2)}</Text></View>
          <View style={styles.filaResumen}><Text style={styles.label}>Impuestos:</Text><Text style={[styles.valor, {color: '#ff7675'}]}>- Q{impuestosDia.toFixed(2)}</Text></View>
          <View style={styles.separador} />
          <View style={styles.filaResumen}><Text style={styles.labelTotal}>GANANCIA NETA:</Text><Text style={styles.valorTotal}>Q{gananciaNetaDia.toFixed(2)}</Text></View>

          <TouchableOpacity 
            style={styles.btnCierre} 
            onPress={() => Alert.alert("Cerrar Día", "¿Deseas limpiar las ventas de hoy y guardar en bitácora?", [
              {text: "No"}, {text: "Sí, Finalizar", onPress: finalizarDia}
            ])}
          >
            <Text style={styles.btnCierreText}>FINALIZAR JORNADA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.proHeader}>
          <Ionicons name="ribbon" size={22} color={esPro ? "#00ff88" : "#666"} />
          <Text style={[styles.proTitle, { color: esPro ? "#00ff88" : "#fff" }]}> Historial de Cierres</Text>
        </View>

        {esPro ? (
          <View style={styles.bitacoraContainer}>
            {historialCompleto.length > 0 ? (
              historialCompleto.slice().reverse().map((cierre) => (
                <View key={cierre.id} style={styles.cierreRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cierreFecha}>{cierre.fecha}</Text>
                    <Text style={styles.cierreMonto}>Total: Q{cierre.total.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity onPress={() => generarPDF(`Cierre ${cierre.fecha}`, cierre.detalle, cierre.total, cierre.ganancia)}>
                    <Ionicons name="cloud-download" size={24} color="#00ff88" />
                  </TouchableOpacity>
                </View>
              ))
            ) : <Text style={styles.emptyText}>No hay cierres guardados.</Text>}
          </View>
        ) : (
          <View style={styles.lockedCard}>
            <Ionicons name="lock-closed" size={40} color="#ffb606" />
            <Text style={styles.lockedTitle}>Historial Bloqueado</Text>
            <TouchableOpacity style={styles.btnUpgrade} onPress={() => setModalProVisible(true)}>
              <Text style={styles.btnUpgradeText}>ACTIVAR FUNCIONES PRO</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      <Modal visible={modalProVisible} animationType="fade" transparent={true}>
        <View style={styles.modalCentered}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Activar Kabal Pro</Text>
            <TextInput 
              placeholder="Ingresa tu llave VIP" 
              style={styles.inputPro} 
              autoCapitalize="characters"
              value={codigoIngresado}
              onChangeText={setCodigoIngresado}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalProVisible(false)}><Text style={{color: '#666'}}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btnValidar} onPress={manejarActivacion}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>Activar Ahora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginLeft: 20, marginBottom: 20 },
  resumenCard: { backgroundColor: '#1e1e30', marginHorizontal: 20, padding: 25, borderRadius: 25, elevation: 5 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  resumenTitulo: { color: '#00d2ff', fontSize: 18, fontWeight: 'bold' },
  pdfBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,210,255,0.1)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  pdfBtnText: { color: '#00d2ff', fontWeight: 'bold', fontSize: 11 },
  filaResumen: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#aaa', fontSize: 15 },
  valor: { color: '#fff', fontWeight: '600', fontSize: 15 },
  separador: { height: 1, backgroundColor: '#333', marginVertical: 12 },
  labelTotal: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  valorTotal: { color: '#00ff88', fontSize: 28, fontWeight: 'bold' },
  btnCierre: { backgroundColor: '#302b63', marginTop: 20, padding: 18, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#00d2ff' },
  btnCierreText: { color: '#00d2ff', fontWeight: 'bold', fontSize: 16 },
  proHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginLeft: 25, marginBottom: 15 },
  proTitle: { fontSize: 18, fontWeight: 'bold' },
  bitacoraContainer: { paddingHorizontal: 20 },
  cierreRow: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 18, borderRadius: 15, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  cierreFecha: { color: '#00d2ff', fontWeight: 'bold', fontSize: 16 },
  cierreMonto: { color: '#aaa', fontSize: 13, marginTop: 4 },
  emptyText: { color: '#777', textAlign: 'center', marginTop: 10 },
  lockedCard: { backgroundColor: '#1e1e30', marginHorizontal: 20, padding: 40, borderRadius: 25, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ffb606' },
  lockedTitle: { color: '#fff', marginVertical: 15, fontSize: 16 },
  btnUpgrade: { backgroundColor: '#ffb606', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 15 },
  btnUpgradeText: { fontWeight: 'bold', color: '#000' },
  modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.85)' },
  modalView: { width: '85%', backgroundColor: '#fff', borderRadius: 25, padding: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#0f0c29' },
  inputPro: { backgroundColor: '#f5f5f5', borderRadius: 15, padding: 18, marginBottom: 25, textAlign: 'center', fontWeight: 'bold', fontSize: 18, color: '#0f0c29', borderWidth: 1, borderColor: '#ddd' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btnValidar: { backgroundColor: '#0f0c29', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12 }
});