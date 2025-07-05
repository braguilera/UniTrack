import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, StatusBar, Modal } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Importa los componentes de mapa
import IndexMap from '../components/IndexMap';
import Independencia1Map from '../components/Independencia1Map';
import Independencia2Map from '../components/Independencia2Map';

// Importa el contexto de BLE
import { useBLEContext } from '../services/BLEProvider';

const HomeScreen = () => {
    const [activeMap, setActiveMap] = useState('index');
    const navigation = useNavigation();
    const [showLocationModal, setShowLocationModal] = useState(false);
    

    // --- LÓGICA DE CONTEXTO ---
    const { requestPermissions, scanForDevices, stopScanning, isConcurrencyModeActive, toggleConcurrencyMode } = useBLEContext();

    useEffect(() => {
        const startScanOnMount = async () => {
            const permissionsGranted = await requestPermissions();
            if (permissionsGranted) {
                scanForDevices();
            } else {
                console.log("Los permisos de Bluetooth son necesarios para el estado de los ascensores.");
            }
        };
        startScanOnMount();
        return () => stopScanning();
    }, []);

    const renderActiveMap = () => {
        switch (activeMap) {
            case 'independencia1':
                return <Independencia1Map onGoBack={() => setActiveMap('index')} />;
            case 'independencia2':
                return <Independencia2Map onGoBack={() => setActiveMap('index')} />;
            case 'index':
            default:
                return <IndexMap onSelectBuilding={(building) => setActiveMap(building)} />;
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Quick Actions */}
            {/* <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Information')}
                    style={[styles.quickAction, styles.infoAction]}
                >
                    <View style={[styles.quickActionIconContainer, {backgroundColor: '#DBEAFE'}]}>
                        <MaterialIcons name="info-outline" size={20} color="#3B82F6" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.quickActionTitle, {color: '#1D4ED8'}]}>Información</Text>
                        <Text style={[styles.quickActionSubtitle, {color: '#3B82F6'}]}>Servicios</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Camera')}
                    style={[styles.quickAction, styles.qrAction]}
                >
                    <View style={[styles.quickActionIconContainer, {backgroundColor: '#D1FAE5'}]}>
                        <MaterialIcons name="qr-code-scanner" size={20} color="#059669" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.quickActionTitle, {color: '#047857'}]}>Escanear QR</Text>
                        <Text style={[styles.quickActionSubtitle, {color: '#059669'}]}>Abre la cámara</Text>
                    </View>
                </TouchableOpacity> 
            </View>*/}


            {/* Map Container with Enhanced Design */}
            <View className="flex-1 px-6 py-10">
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
                    {/* Map Header */}
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
                    
                    {/* Map Content */}
                    <View className="flex-1">
                        {renderActiveMap()}
                    </View>
                </View>
            </View>
            

            {/* Barra de botones inferior */}

            {activeMap !== 'index' && (

            <View style={styles.bottomBar}>
                <View style={styles.buttonContainer}>
                    {/* <TouchableOpacity
                        onPress={() => setShowLocationModal(true)}
                        style={[styles.navButton, { backgroundColor: '#E5E7EB' }]}
                    >
                        <MaterialIcons name="map" size={20} color="#4B5563" style={{ marginRight: 8 }} />
                        <Text style={[styles.navButtonText, { color:'#4B5563' }]}>Mapa 3D</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        onPress={toggleConcurrencyMode}
                        style={[
                            styles.navButton,
                            isConcurrencyModeActive ? { backgroundColor: '#1b6bf7' } : { backgroundColor: '#E5E7EB' }
                        ]}
                    >
                        <MaterialIcons
                            name="groups"
                            size={20}
                            color={isConcurrencyModeActive ? '#FFFFFF' : '#4B5563'}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={[styles.navButtonText, { color: isConcurrencyModeActive ? '#FFFFFF' : '#4B5563' }]}>
                            Concurrencia
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            )}

            {/* Location Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showLocationModal}
                onRequestClose={() => setShowLocationModal(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white rounded-2xl p-6 mx-8 shadow-2xl">
                    {/* Header with Icon */}
                    <View className="items-center mb-4">
                    <View className="w-16 h-16 bg-blue-100 rounded-full justify-center items-center mb-3">
                        <FontAwesome5 name="map-marker-alt" size={28} color="#3B82F6" />
                    </View>
                    <Text className="text-xl font-bold text-gray-800 text-center">
                        En futuras actualizaciones
                    </Text>
                    </View>

                    {/* OK Button */}
                    <TouchableOpacity
                    onPress={() => setShowLocationModal(false)}
                    className="bg-blue-600 rounded-xl py-3 px-6 shadow-lg"
                    >
                    <Text className="text-white text-center font-semibold text-lg">
                        Entendido
                    </Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF', 
        paddingBottom: 100
    },
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingTop: 8,
        width: '50%',
        paddingBottom: 8,
        backgroundColor: 'white'
    },
    quickAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 8,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoAction: {
        backgroundColor: '#EFF6FF',
        borderColor: '#DBEAFE',
        shadowColor: '#3B82F6',
        marginRight: 2,
    },
    qrAction: {
        backgroundColor: '#ECFDF5',
        borderColor: '#D1FAE5',
        shadowColor: '#10B981',
        marginLeft: 6,
    },
    quickActionIconContainer: {
        width: 22,
        height: 22,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    quickActionTitle: {
        fontWeight: '600',
        fontSize: 14,
    },
    quickActionSubtitle: {
        fontSize: 12,
    },
    mapViewContainer: { 
        flex: 1, 
        margin: 24, 
        borderRadius: 16, 
        overflow: 'hidden', 
        elevation: 4, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    bottomBar: {
        paddingHorizontal: 24,
        paddingTop: 16
    },
    buttonContainer: {
        backgroundColor: 'white',
        borderRadius: 99,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        flexDirection: 'row',
        padding: 4,
    },
    navButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 99,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
    },
    navButtonText: {
        fontWeight: '600',
        fontSize: 12,
    },
});

export default HomeScreen;
