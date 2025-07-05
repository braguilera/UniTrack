import { useState, useMemo, useRef } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";

// --- Criterios de filtro combinados ---
const TARGET_DEVICE_ID = "B4:1B:B0:17:6A:26";
const TARGET_DEVICE_NAME = "[TV] Samsung AU7 65 TV"; // En minúsculas para comparación sin distinción
const RSSI_THRESHOLD = -60; // Umbral de RSSI
const SCAN_CYCLE_INTERVAL = 20000; // 20 segundos en milisegundos

export default function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [deviceCount, setDeviceCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const devicesInCycleRef = useRef(new Map());
  const cycleIntervalRef = useRef(null);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Permiso de Escaneo Bluetooth",
        message: "Esta app necesita permiso para escanear dispositivos Bluetooth.",
        buttonPositive: "Aceptar",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Permiso de Conexión Bluetooth",
        message: "Esta app necesita permiso para conectar a dispositivos Bluetooth.",
        buttonPositive: "Aceptar",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permiso de Ubicación",
        message: "Esta app necesita permiso de ubicación para buscar dispositivos Bluetooth.",
        buttonPositive: "Aceptar",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? 0) >= 31) {
        return await requestAndroid31Permissions();
      } else {
        const locationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permiso de Ubicación",
            message: "Esta app necesita permiso de ubicación para buscar dispositivos Bluetooth.",
            buttonPositive: "Aceptar",
          }
        );
        return locationPermission === "granted";
      }
    }
    return true;
  };

  const scanForDevices = () => {
    const runScanCycle = () => {
      console.log("Iniciando nuevo ciclo de escaneo...");
      devicesInCycleRef.current.clear();
      
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error("Error en el escaneo:", error);
          stopScanning(); 
          return;
        }

        const isTargetDevice =
          device?.id === TARGET_DEVICE_ID ||
          device?.name?.toLowerCase() === TARGET_DEVICE_NAME;
        
        const isDeviceClose =
          typeof device?.rssi === 'number' && device.rssi > RSSI_THRESHOLD;

        console.log(`[useBLE] Dispositivo detectado: ${device?.name || 'desconocido'} (${device?.id}) con RSSI: ${device?.rssi}`);

        if (isTargetDevice && isDeviceClose) {
          devicesInCycleRef.current.set(device.id, device);
        }
      });
    };

    const cycleAction = () => {
      bleManager.stopDeviceScan();
      const currentSize = devicesInCycleRef.current.size;
      setDeviceCount(currentSize);
      // --- AÑADIDO: Muestra el conteo en consola en cada ciclo ---
      console.log(`[useBLE] Dispositivos encontrados en este ciclo: ${currentSize}`);
      runScanCycle();
    };

    setIsScanning(true);
    setDeviceCount(0);
    runScanCycle(); 
    
    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current);
    }
    cycleIntervalRef.current = setInterval(cycleAction, SCAN_CYCLE_INTERVAL);
  };

  const stopScanning = () => {
    bleManager.stopDeviceScan();
    setIsScanning(false);
    
    if (cycleIntervalRef.current) {
      clearInterval(cycleIntervalRef.current);
      cycleIntervalRef.current = null;
    }
    setDeviceCount(0);
    console.log("Escaneo detenido y ciclo de actualización limpiado.");
  };

  return { requestPermissions, scanForDevices, stopScanning, deviceCount, isScanning };
}
