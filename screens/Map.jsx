import React, { useState, useEffect } from 'react';
import { 
    View, Text, TouchableOpacity, SafeAreaView, StatusBar,
    StyleSheet, ActivityIndicator 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Importa los componentes de mapa
import IndexMap from '../components/IndexMap';
import Independencia1Map from '../components/Independencia1Map';
import Independencia2Map from '../components/Independencia2Map';

// MODIFICADO: Importamos el hook del contexto en lugar del hook directo
import { useBLEContext } from '../services/BLEProvider';

const HomeScreen = () => {
    const [activeButton, setActiveButton] = useState('mapa2d');
    const [activeMap, setActiveMap] = useState('index'); 
    const navigation = useNavigation();
    
    // MODIFICADO: Consumimos los datos del contexto global
    const { requestPermissions, scanForDevices, stopScanning, deviceCount, isScanning } = useBLEContext();
    const [hasPermissions, setHasPermissions] = useState(false);

    // --- NUEVO: Hook para iniciar el escaneo automáticamente al cargar la app ---
    useEffect(() => {
        const startScanOnMount = async () => {
            const permissionsGranted = await requestPermissions();
            if (permissionsGranted) {
                setHasPermissions(true);
                scanForDevices(); // Inicia el escaneo
            } else {
                setHasPermissions(false);
                console.log("Los permisos de Bluetooth y ubicación son necesarios.");
            }
        };

        startScanOnMount();

        // Función de limpieza: se ejecuta cuando el componente se desmonta.
        // Detiene el escaneo para ahorrar batería si el usuario cierra la app o navega a otra pantalla.
        return () => {
            stopScanning();
        };
    }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente.

    const renderActiveMap = () => {
        // La lógica del mapa no cambia
        switch (activeMap) {
            case 'independencia1':
                return <Independencia1Map onGoBack={() => setActiveMap('index')} deviceCount={deviceCount} />;
            case 'independencia2':
                return <Independencia2Map onGoBack={() => setActiveMap('index')} deviceCount={deviceCount} />;
            case 'index':
            default:
                // Pasamos deviceCount a los mapas por si lo necesitas allí
                return <IndexMap onSelectBuilding={(building) => setActiveMap(building)} deviceCount={deviceCount} />;
        }
    };

    // --- MODIFICADO: La función renderContent ahora es mucho más simple ---
    const renderContent = () => {
        if (activeButton === 'concurrencia') {
            return (
                <View style={styles.concurrencyContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Concurrencia en Tiempo Real</Text>
                        {isScanning && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginBottom: 20 }} />}
                        {!hasPermissions ? (
                           <Text style={styles.permissionText}>Se requieren permisos para medir la concurrencia.</Text>
                        ) : (
                           <View style={styles.concurrencyDisplay}>
                                <Text style={styles.deviceCountLabel}>Dispositivos Detectados:</Text>
                                <Text style={styles.deviceCountNumber}>{deviceCount}</Text>
                           </View>
                        )}
                    </View>
                </View>
            );
        }
        
        // La vista del mapa no cambia
        return (
            <View 
                className="flex-1 bg-white rounded-3xl overflow-hidden border border-gray-100"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 8,
                }}
            >
                <View className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            <Text className="text-gray-700 font-medium text-sm">
                                {activeMap === 'index' ? 'Vista General' : 
                                 activeMap === 'independencia1' ? 'Independencia 1' : 
                                 'Independencia 2'}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialIcons name="my-location" size={16} color="#6B7280" />
                            <Text className="text-gray-500 text-xs ml-1">En vivo</Text>
                        </View>
                    </View>
                </View>
                
                <View className="flex-1">
                    {renderActiveMap()}
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
            
            {/* --- Secciones de botones (sin cambios) --- */}
            <View className="bg-white px-6 pt-2 pb-6">
                <View className="flex-row space-x-3 mb-4">
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Information')}
                        className="flex-1 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex-row items-center"
                        style={{ elevation: 3 }}
                    >
                        <View className="w-10 h-10 bg-blue-100 rounded-full justify-center items-center mr-3">
                            <MaterialIcons name="info-outline" size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-blue-700 font-semibold text-sm">Información</Text>
                            <Text className="text-blue-600 text-xs">Servicios del campus</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Camera')}
                        className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4 flex-row items-center"
                        style={{ elevation: 3 }}
                    >
                        <View className="w-10 h-10 bg-green-100 rounded-full justify-center items-center mr-3">
                            <MaterialIcons name="qr-code-scanner" size={20} color="#10B981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-green-700 font-semibold text-sm">Escanear QR</Text>
                            <Text className="text-green-600 text-xs">Ubicación actual</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="px-6 py-6">
                <View 
                    className="bg-white rounded-3xl p-3 flex-row"
                    style={{ elevation: 12 }}
                >
                    <TouchableOpacity
                        onPress={() => setActiveButton('mapa2d')}
                        className={`flex-1 py-4 px-6 rounded-2xl flex-row items-center justify-center ${
                            activeButton === 'mapa2d' ? 'bg-blue-600' : 'bg-transparent'
                        }`}
                        style={activeButton === 'mapa2d' ? { elevation: 6 } : {}}
                    >
                        <View className={`w-8 h-8 rounded-full justify-center items-center mr-2 ${
                            activeButton === 'mapa2d' ? 'bg-blue-500' : 'bg-gray-100'
                        }`}>
                            <MaterialIcons
                                name="map"
                                size={18}
                                color={activeButton === 'mapa2d' ? '#FFFFFF' : '#6B7280'}
                            />
                        </View>
                        <Text className={`font-semibold ${
                            activeButton === 'mapa2d' ? 'text-white' : 'text-gray-600'
                        }`}>
                            Mapa 2D
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveButton('concurrencia')}
                        className={`flex-1 py-4 px-6 rounded-2xl flex-row items-center justify-center ${
                            activeButton === 'concurrencia' ? 'bg-purple-600' : 'bg-transparent'
                        }`}
                        style={activeButton === 'concurrencia' ? { elevation: 6 } : {}}
                    >
                        <View className={`w-8 h-8 rounded-full justify-center items-center mr-2 ${
                            activeButton === 'concurrencia' ? 'bg-purple-500' : 'bg-gray-100'
                        }`}>
                            <MaterialIcons name="groups" size={18} color={activeButton === 'concurrencia' ? '#FFFFFF' : '#6B7280'}/>
                        </View>
                        <Text className={`font-semibold ${
                            activeButton === 'concurrencia' ? 'text-white' : 'text-gray-600'
                        }`}>
                            Concurrencia
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View className="flex-1 px-6 pb-6">
              {renderContent()}
            </View>
        </SafeAreaView>
    );
};

// --- ESTILOS MODIFICADOS ---
const styles = StyleSheet.create({
    concurrencyContainer: {
        flex: 1,
        backgroundColor: "#1e1e1e",
        borderRadius: 24,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: { 
        padding: 20, 
        alignItems: "center",
    },
    title: { 
        fontSize: 22, 
        fontWeight: "bold", 
        color: "#fff", 
        marginBottom: 24,
        textAlign: 'center',
    },
    concurrencyDisplay: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#2a2a2a',
        borderRadius: 16,
    },
    deviceCountLabel: {
        fontSize: 18, 
        color: "#bbb",
    },
    deviceCountNumber: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 8,
    },
    permissionText: {
        color: '#a0a0a0',
        textAlign: 'center',
        fontSize: 16,
        paddingHorizontal: 20,
    },
});

export default HomeScreen;
