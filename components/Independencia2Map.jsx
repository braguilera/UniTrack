import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView, Image } from 'react-native'; 
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons'; 
import MapView, { PROVIDER_GOOGLE, Overlay, Polygon } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { useBLEContext } from '../services/BLEProvider'; // Asegúrate que la ruta sea correcta

// --- COMPONENTES AUXILIARES ---

const ConcurrencyMeter = ({ level }) => {
    const levelLower = level ? level.toLowerCase() : '';
    const bars = [1, 2, 3];
    const getColor = (barIndex) => {
        if (levelLower === 'baja' && barIndex === 0) return '#10B981';
        if (levelLower === 'media' && barIndex < 2) return '#F59E0B';
        if (levelLower === 'alta' && barIndex < 3) return '#EF4444';
        return '#E5E7EB';
    };
    return (
        <View style={styles.meterContainer}>
            {bars.map((_, index) => (
                <View key={index} style={[styles.meterBar, { backgroundColor: getColor(index) }]} />
            ))}
            <Text style={styles.meterText}>{level || 'N/A'}</Text>
        </View>
    );
};

// --- COMPONENTE DE TARJETA DE DETALLES (CON LA LÓGICA DE NAVEGACIÓN) ---

const SalaDetailCard = ({ sala, onClose }) => {
    const navigation = useNavigation();
    const { setRouteDestination, deviceCount } = useBLEContext();

    const handleGoHere = () => {
        const destinationId = sala.routingId || sala.id;
        if (!destinationId) {
            console.error("Esta sala no tiene un 'routingId' o 'id' para la navegación.");
            return;
        }
        console.log(`Guardando destino en contexto: "${destinationId}"`);
        setRouteDestination(destinationId);
        
        // Navega directamente a la pantalla del mapa dentro de la pestaña de rutas
        navigation.navigate('Route');
    };

    const details = sala.nombre.split('\n');
    const title = details.shift();
    const parsedDetails = details.map(line => {
        const parts = line.split(':');
        return { key: parts[0]?.trim(), value: parts[1]?.trim() };
    }).filter(detail => detail.key && detail.value);
    
    let finalConcurrency = sala.concurrencia;
    if (sala.tipo === 'ascensor' && !sala.nombre.includes('En mantenimiento')) {
        if (deviceCount === 0) finalConcurrency = 'Baja';
        else if (deviceCount === 1) finalConcurrency = 'Media';
        else if (deviceCount >= 2) finalConcurrency = 'Alta';
    }
    
    if (finalConcurrency) {
        const existingIndex = parsedDetails.findIndex(d => d.key.toLowerCase() === 'concurrencia');
        if (existingIndex !== -1) {
            parsedDetails[existingIndex].value = finalConcurrency;
        } else {
            parsedDetails.push({ key: 'Concurrencia', value: finalConcurrency });
        }
    }
    
    const getIconForDetail = (key) => {
        switch (key.toLowerCase()) {
            case 'concurrencia': return 'account-multiple'; case 'edificio': return 'domain'; case 'piso': return 'layers-outline'; case 'número': return 'pound'; case 'capacidad': return 'account-group-outline'; case 'tipo de aula': return 'cast-education'; case 'estado': return 'information-outline'; case 'horario de disponibilidad': return 'clock-outline'; case 'género': return 'gender-male-female'; case 'conecta pisos': return 'stairs'; case 'tipo': return 'tag-outline'; case 'nombre': return 'pencil-outline'; case 'tipo de local': return 'store-outline'; case 'horario de atención': return 'calendar-clock';
            default: return 'chevron-right';
        }
    };

    const getStatusStyle = (status) => {
        const s = status ? status.toLowerCase() : '';
        if (s.includes('disponible') || s.includes('activo') || s.includes('operativo')) return styles.statusAvailable;
        if (s.includes('reservada')) return styles.statusWarning;
        if (s.includes('en mantenimiento') || s.includes('cerrado')) return styles.statusError;
        return {};
    };

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close-circle" size={28} color="#9CA3AF" />
            </TouchableOpacity>
            <View style={styles.grabber} />
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
                <TouchableOpacity style={styles.navigateButton} onPress={handleGoHere}>
                    <MaterialIcons name="navigation" size={16} color="white" />
                    <Text style={styles.navigateButtonText}>Ir aquí</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.detailsList} showsVerticalScrollIndicator={false}>
                {parsedDetails.map((detail, index) => (
                    <View key={index} style={styles.detailRow}>
                        <MaterialCommunityIcons name={getIconForDetail(detail.key)} size={20} color="#4B5563" style={styles.icon} />
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailKey}>{detail.key}:</Text>
                            {detail.key.toLowerCase() === 'concurrencia' ? 
                                ( <ConcurrencyMeter level={detail.value} /> ) : 
                                ( <Text style={[styles.detailValue, getStatusStyle(detail.value)]}>{detail.value}</Text> )
                            }
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

// --- COMPONENTE PRINCIPAL DEL MAPA ---

const Independencia2Map = ({ onGoBack }) => {
    const [selectedSala, setSelectedSala] = useState(null); 
    const { isConcurrencyModeActive, deviceCount } = useBLEContext();

    const planoInteriorImageSource = require('../assets/images/MapaIND2.png');
    const imageDimensions = Image.resolveAssetSource(planoInteriorImageSource);
    const NEW_IMAGE_ASPECT_RATIO = imageDimensions.width / imageDimensions.height;
    const OLD_ASPECT_RATIO = 720 / 1200;
    const longitudeScalingFactor = NEW_IMAGE_ASPECT_RATIO / OLD_ASPECT_RATIO;

    const MAP_MAIN_DIMENSION = 0.02; 
    const INITIAL_LATITUDE_DELTA = MAP_MAIN_DIMENSION * 1.5; 
    const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * NEW_IMAGE_ASPECT_RATIO;
    const planoBounds = [[-MAP_MAIN_DIMENSION / 2, -(MAP_MAIN_DIMENSION * NEW_IMAGE_ASPECT_RATIO) / 2], [MAP_MAIN_DIMENSION / 2, (MAP_MAIN_DIMENSION * NEW_IMAGE_ASPECT_RATIO) / 2]];
    const initialMapRegion = { latitude: 0, longitude: 0, latitudeDelta: INITIAL_LATITUDE_DELTA, longitudeDelta: INITIAL_LONGITUDE_DELTA };
    
    const customMapStyle = [ { elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] }, { elementType: 'labels', stylers: [{ visibility: 'off' }] }, { featureType: 'administrative', stylers: [{ visibility: 'off' }] }, { featureType: 'poi', stylers: [{ visibility: 'off' }] }, { featureType: 'road', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }, { featureType: 'water', stylers: [{ color: '#FFFFFF' }] }, ];
    
    // --- MODIFICADO: Se añaden los `routingId` a cada sala ---
    const salasOriginales = [ 
        { id: 'Escalera1', routingId: 'Escalera Indep2', nombre: 'Escaleras\nEdificio: Independencia 2\nPiso: 5\nConecta pisos: 1-8', tipo: 'estructura',concurrencia: 'Baja', coordenadas: [ { latitude: 0.0099, longitude:  0.0059 },{ latitude: 0.0099, longitude: 0.0009 },{ latitude: 0.0052, longitude: 0.0009 },{ latitude: 0.0052, longitude: 0.0059 }, ] },
        { id: 'Ascensor1', routingId: 'Ascensor Indep2', nombre: 'Ascensor\nEdificio: Independencia 2\nPiso: 5\nConecta pisos: 1-8\nEstado: Disponible', tipo: 'ascensor', coordenadas: [ { latitude: 0.01, longitude: -0.0002 }, { latitude: 0.0065, longitude: -0.0002 }, { latitude: 0.0065, longitude: 0.0008  }, { latitude: 0.01, longitude:   0.0008 }, ] },
        { id: 'Ascensor2', routingId: 'Ascensor Indep2', nombre: 'Ascensor\nEdificio: Independencia 2\nPiso: 5\nConecta pisos: 1-8\nEstado: Disponible', tipo: 'ascensor', coordenadas: [ { latitude: 0.01, longitude: -0.0013}, { latitude: 0.0065, longitude: -0.0013 }, { latitude: 0.0065, longitude: -0.00025  }, { latitude: 0.01, longitude:   -0.00025 }, ] },
        { id: 'Aula6', routingId: 'Aula 548', nombre: 'Aula 548\nEdificio: Independencia 2\nPiso: 5\nNúmero: 106\n...', tipo: 'aula', concurrencia: 'Alta', coordenadas: [ { latitude:  -0.01, longitude:  0.0001 }, { latitude:  -0.01, longitude:  0.0059 }, { latitude:  0.0028, longitude:  0.0059 }, { latitude:  0.0028, longitude:  0.0018 }, { latitude:  0.00135, longitude:  0.0018 }, { latitude:  0.00135, longitude:  0.0001 } ] },
        { id: 'Aula7', routingId: 'Aula 547', nombre: 'Aula 547\nEdificio: Independencia 2\nPiso: 5\nNúmero: 101\n...', tipo: 'aula', concurrencia: 'Baja', coordenadas: [ { latitude: 0.0027, longitude: -0.006 }, { latitude: -0.01, longitude:  -0.006 }, { latitude: -0.01, longitude:  -0.001 }, { latitude: 0.0027, longitude: -0.001}, ] },
        { id: 'Limpieza1', routingId: 'Limpieza', nombre: 'Almacenamiento\nEdificio: Independencia 2\nPiso: 5\nNúmero: 10\n...', tipo: 'servicio', concurrencia: 'Baja', coordenadas: [ { latitude: 0.01, longitude:   -0.00223 }, { latitude: 0.0049, longitude: -0.00223 }, { latitude: 0.0049, longitude: -0.0013 }, { latitude: 0.01, longitude:   -0.0013 }, ] },
        { id: 'Baños1', routingId: 'Baño de Hombres', nombre: 'Baño Hombre\nEdificio: Independencia 2\nPiso: 5\nGénero: Masculino\nEstado: Operativo', tipo: 'servicio', concurrencia: 'Baja', coordenadas: [ { latitude: 0.01, longitude:   -0.0041 }, { latitude: 0.0049, longitude: -0.0041 }, { latitude: 0.0049, longitude: -0.00223 }, { latitude: 0.01, longitude:   -0.00223 }, ] },
        { id: 'Baños2', routingId: 'Baño de Mujeres', nombre: 'Baño Mujer\nEdificio: Independencia 2\nPiso: 5\nGénero: Femenino\nEstado: Operativo', tipo: 'servicio', concurrencia: 'Media', coordenadas: [ { latitude: 0.01, longitude:   -0.006 }, { latitude: 0.0049, longitude: -0.006 }, { latitude: 0.0049, longitude: -0.0041 }, { latitude: 0.01, longitude:   -0.0041 }, ] }, 
    ];

    const salas = salasOriginales.map(sala => ({
        ...sala,
        coordenadas: sala.coordenadas.map(coord => ({
            ...coord,
            longitude: coord.longitude * longitudeScalingFactor
        }))
    }));

    // El resto de tus funciones y lógica del mapa se mantiene igual
    const colorModes = new Map();
    const modoNormalColores = { aula: 'rgba(78, 188, 240, 0.4)', ascensor: 'rgba(128, 128, 128, 0.4)', estructura: 'rgba(176, 190, 197, 0.5)', servicio: 'rgba(207, 216, 220, 0.6)', mantenimiento: 'rgba(149, 165, 166, 0.7)', };
    colorModes.set('modoNormal', modoNormalColores);
    const modoConcurrenciaColores = { Baja: 'rgba(46, 204, 113, 0.7)', Media: 'rgba(243, 156, 18, 0.7)', Alta: 'rgba(231, 76, 60, 0.7)', mantenimiento: 'rgba(149, 165, 166, 0.7)', Default: 'rgba(200, 200, 200, 0.5)', };
    colorModes.set('modoConcurrencia', modoConcurrenciaColores);

    const getSalaColor = (sala) => {
        const modoActual = isConcurrencyModeActive ? 'modoConcurrencia' : 'modoNormal';
        const paletaNormal = colorModes.get('modoNormal');
        const paletaConcurrencia = colorModes.get('modoConcurrencia');

        if (sala.nombre.includes('En mantenimiento') || sala.nombre.includes('Cerrado')) return paletaNormal.mantenimiento;
        if (sala.tipo === 'ascensor') { if (deviceCount === 0) return paletaConcurrencia.Baja; if (deviceCount === 1) return paletaConcurrencia.Media; return paletaConcurrencia.Alta; }
        if (modoActual === 'modoConcurrencia') return paletaConcurrencia[sala.concurrencia] || paletaConcurrencia.Default;
        else return paletaNormal[sala.tipo] || paletaNormal.servicio;
    };

    const handleSalaPress = (sala) => setSelectedSala(sala);
    const handleMapPress = () => setSelectedSala(null);

    return (
        <View style={styles.container}>
            <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={initialMapRegion} customMapStyle={customMapStyle} minZoomLevel={14} maxZoomLevel={16} onPress={handleMapPress} rotateEnabled={false} pitchEnabled={false}>
                <Overlay image={planoInteriorImageSource} bounds={planoBounds} opacity={1} />
                {salas.map(sala => (
                    <Polygon
                        key={sala.id} coordinates={sala.coordenadas}
                        fillColor={selectedSala?.id === sala.id ? 'rgba(29, 78, 216, 0.7)' : getSalaColor(sala)} 
                        strokeColor="rgba(0,0,0,0.7)" strokeWidth={1.5} tappable onPress={() => handleSalaPress(sala)} 
                    />
                ))}
            </MapView>
            
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onGoBack} style={styles.backButton}><MaterialIcons name="arrow-back" size={24} color="#374151" /></TouchableOpacity>
            </View>

            {selectedSala && <SalaDetailCard sala={selectedSala} onClose={handleMapPress} />}
        </View>
    );
};

// --- ESTILOS ---
// (Tu objeto de estilos va aquí, lo he omitido por brevedad pero debe estar en tu archivo)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    map: { ...StyleSheet.absoluteFillObject },
    headerContainer: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },
    backButton: { position: 'absolute', left: 16, backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 20, padding: 8, },
    title: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', backgroundColor: 'rgba(255, 255, 255, 0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, overflow: 'hidden' },
    cardContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 16,
        paddingTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 16,
        maxHeight: '60%',
    },
    grabber: {
        width: 40,
        height: 5,
        backgroundColor: '#D1D5DB',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginBottom: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 28,
        right: 12,
        zIndex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1, 
    },
    navigateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981', 
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginRight: 40,
    },
    navigateButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14,
    },
  detailsList: {
    maxHeight: 100,
    paddingTop: 8,
  },

    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    icon: {
        marginRight: 12,
        marginTop: 2,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailKey: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: '#1F2937',
    },
    statusAvailable: { color: '#10B981', fontWeight: 'bold' },
    statusWarning: { color: '#F59E0B', fontWeight: 'bold' },
    statusError: { color: '#EF4444', fontWeight: 'bold' },
    meterContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    meterBar: { width: 12, height: 16, borderRadius: 3 },
    meterText: { fontSize: 15, color: '#374151', fontWeight: '600', marginLeft: 8 },
});

export default Independencia2Map;