import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView } from 'react-native'; 
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons'; 
import MapView, { PROVIDER_GOOGLE, Overlay, Polygon } from 'react-native-maps';
import { useBLEContext } from '../services/BLEProvider';
import { useNavigation } from '@react-navigation/native';

// --- LÓGICA DE COLORES ---
const colorModes = new Map();
const modoNormalColores = {
  aula: "rgba(78, 188, 240, 0.4)",
  ascensor: "rgba(128, 128, 128, 0.4)",
  estructura: "rgba(176, 190, 197, 0.5)",
  comercio: "rgba(176, 190, 197, 0.5)",
  servicio: "rgba(207, 216, 220, 0.6)",
  mantenimiento: "rgba(176, 190, 197, 0.5)",
}
colorModes.set("modoNormal", modoNormalColores)
const modoConcurrenciaColores = {
  Baja: "rgba(46, 204, 113, 0.7)",
  Media: "rgba(243, 156, 18, 0.7)",
  Alta: "rgba(231, 76, 60, 0.7)",
  mantenimiento: "rgba(243, 156, 18, 0.7)",
  Default: "rgba(243, 156, 18, 0.7)",
}
colorModes.set('modoConcurrencia', modoConcurrenciaColores);

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

const SalaDetailCard = ({ sala, onClose }) => {
    // NUEVO: Se obtienen las funciones de navegación y del contexto
    const navigation = useNavigation();
    const { setRouteDestination, deviceCount } = useBLEContext();

    // NUEVO: Función que se ejecuta al presionar "Ir aquí"
    const handleGoHere = () => {
        const destinationId = sala.routingId || sala.id;

        if (!destinationId) {
            console.error("Esta sala no tiene un 'routingId' o 'id' para la navegación.");
            return;
        }

        // 1. Guarda el destino en el estado global (Contexto)
        console.log(`Guardando destino en contexto: "${destinationId}"`);
        setRouteDestination(destinationId);

        // 2. Navega a la pantalla del mapa
        // Nota: Navegamos a 'Map' dentro de 'Route' para ir directo al mapa
        // y no a la pantalla inicial de la pestaña.
        navigation.navigate('Route');
    };

    // --- El resto de tu lógica para procesar los detalles de la sala se mantiene igual ---
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
                
            {/* NUEVO: Botón "Ir aquí" */}
            <TouchableOpacity style={styles.navigateButton} onPress={handleGoHere}>
                <MaterialIcons name="navigation" size={16} color="white" />
                <Text style={styles.navigateButtonText}>Ir aquí</Text>
            </TouchableOpacity>

            </View>
            <ScrollView style={styles.detailsList}>
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

const Independencia1Map = ({ onGoBack }) => {
    const [selectedSala, setSelectedSala] = useState(null);
    const { isConcurrencyModeActive, deviceCount } = useBLEContext();

    const planoInteriorImageSource = require('../assets/images/MapaIND1.png');
    const IMAGE_ASPECT_RATIO = 480 / 1200; const MAP_MAIN_DIMENSION = 0.02; const INITIAL_LATITUDE_DELTA = MAP_MAIN_DIMENSION * 1.5; const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * IMAGE_ASPECT_RATIO;
    const planoBounds = [[-MAP_MAIN_DIMENSION / 2, -(MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2], [MAP_MAIN_DIMENSION / 2, (MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2]];
    const initialMapRegion = { latitude: 0, longitude: 0, latitudeDelta: INITIAL_LATITUDE_DELTA, longitudeDelta: INITIAL_LONGITUDE_DELTA };
    
    const customMapStyle = [ { elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] }, { elementType: 'labels', stylers: [{ visibility: 'off' }] }, { featureType: 'administrative', stylers: [{ visibility: 'off' }] }, { featureType: 'poi', stylers: [{ visibility: 'off' }] }, { featureType: 'road', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }, { featureType: 'water', stylers: [{ color: '#FFFFFF' }] }, ];
    
    const salas = [ 
        // Añade el routingId a cada sala. Su valor debe ser el ID que usas en la pantalla de ruteo.
        { id: 'Escalera2', routingId: 'Escalera Indep1', nombre: 'Escaleras\nEdificio: Independencia 1\nPiso: 5\nConecta pisos: 1-8', tipo: 'estructura',concurrencia: 'Baja', coordenadas: [ { latitude: 0.0047, longitude:  0.0008 }, { latitude: 0.0047, longitude:  0.004 }, { latitude: 0.0022, longitude:  0.004 }, { latitude: 0.0022, longitude:  0.0008 }, ] },
        { id: 'Ascensor3', routingId: 'Ascensor Indep1', nombre: 'Ascensor\nEdificio: Independencia 1\nPiso: 5\nConecta pisos: 1-8\nEstado: Disponible', tipo: 'ascensor', coordenadas: [ { latitude:  -0.0003, longitude:  0.00165 }, { latitude: -0.0003, longitude: 0.0028}, { latitude: -0.00175, longitude: 0.0028}, { latitude: -0.00175, longitude: 0.00165}, ] },
        { id: 'Ascensor4', routingId: 'Ascensor Indep1', nombre: 'Ascensor\nEdificio: Independencia 1\nPiso: 5\nConecta pisos: 1-8\nEstado: Disponible', tipo: 'ascensor', coordenadas: [ { latitude: -0.0003, longitude:  0.0028 }, { latitude: -0.0003, longitude: 0.004}, { latitude: -0.00175, longitude: 0.004}, { latitude: -0.00175, longitude: 0.0028}, ] },
        { id: 'Comercio1', routingId: 'Kiosco', nombre: 'Kiosco\nNombre: Kiosco central\nTipo de local: Kiosco\nEstado: Activo\nHorario de atención: Lunes-Viernes (13hs-16hs)', tipo: 'comercio', concurrencia: 'Media', coordenadas: [ { latitude: -0.00175, longitude: 0.0008 }, { latitude: -0.00175, longitude: 0.004 }, { latitude: -0.0055, longitude: 0.004 }, { latitude: -0.0055, longitude: 0.0008 }, ] },
        { id: 'Expendedora1', routingId: 'Expendedora', nombre: 'Maquinas expendedoras\nTipo: Cafe y bebidas', tipo: 'servicio', coordenadas: [ { latitude: -0.00555, longitude: 0.00075 }, { latitude: -0.00555, longitude: 0.00233}, { latitude: -0.00625, longitude: 0.00233 }, { latitude: -0.00625, longitude: 0.00075 }, ] },
        { id: 'Aula5', nombre: 'Aula 542\nEdificio: Independencia 1\nPiso: 5\nNúmero: 105\nCapacidad: 40 personas\nTipo de aula: Teórica (Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Lunes-Jueves(7am-22pm)\nEstado: Disponible', tipo: 'aula', concurrencia: 'Media', coordenadas: [ { latitude: -0.01, longitude: -0.0039 }, { latitude: -0.01, longitude:  0.0008 }, { latitude: -0.0078, longitude:  0.0008 }, { latitude:  -0.0078, longitude:  -0.00058 }, { latitude:  -0.00555, longitude:  -0.00058}, { latitude:  -0.00555, longitude: -0.0039} ] },
        { id: 'Aula4', nombre: 'Aula 543\nEdificio: Independencia 1\nPiso: 5\nNúmero: 104\nCapacidad: 50 personas\nTipo de aula: Teórica (Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Martes-Miercoles (15:00pm-16:30pm)\nEstado: Disponible', tipo: 'aula', concurrencia: 'Alta', coordenadas: [ { latitude: -0.00095, longitude:   -0.0039 }, { latitude: -0.0055, longitude: -0.0039 }, { latitude: -0.0055, longitude: -0.0006 }, { latitude: -0.00095, longitude:   -0.0006 }, ] },
        { id: 'Aula3', nombre: 'Aula 544\nEdificio: Independencia 1\nPiso: 5\nNúmero: 103\nCapacidad: 50 personas\nTipo de aula: Teórica (Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Jueves-Viernes (13:30pm-20pm)\nEstado: Reservada', tipo: 'aula', concurrencia: 'Baja', coordenadas: [ { latitude:  0.00475, longitude:   -0.0039 }, { latitude: -0.00093, longitude: -0.0039 }, { latitude: -0.00093, longitude: -0.0006 }, { latitude:  0.00475, longitude:   -0.0006 }, ] },
        { id: 'Aula2', nombre: 'Aula 545\nEdificio: Independencia 2\nPiso: 5\nNúmero: 102\nCapacidad: 63 personas\nTipo de aula: Práctica (PCs, Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Lunes-Viernes (7am-20pm)', tipo: 'aula', concurrencia: 'Baja', coordenadas: [ { latitude: 0.0099, longitude:   -0.0039 }, { latitude: 0.00475, longitude: -0.0039 }, { latitude: 0.00475, longitude: -0.0006 }, { latitude: 0.0099, longitude:   -0.0006 }, ] }, 
        { id: 'Aula1', nombre: 'Aula 546\nEdificio: Independencia 1\nPiso: 5\nNúmero: 107\nCapacidad: 60 personas\nTipo de aula: Teórica (Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Lunes-Martes (7am-16pm)\nEstado: Reservada', tipo: 'aula', concurrencia: 'Media', coordenadas: [ { latitude: 0.0099, longitude:   0.0039 }, { latitude: 0.00475, longitude: 0.0039 }, { latitude: 0.00475, longitude: 0.00075 }, { latitude: 0.0099, longitude:   0.00075 }, ] }, 
    ];


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
            <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={initialMapRegion} customMapStyle={customMapStyle} minZoomLevel={15} maxZoomLevel={20} rotateEnabled={false} pitchEnabled={false} onPress={handleMapPress}>
                <Overlay image={planoInteriorImageSource} bounds={planoBounds} opacity={1} />
                {salas.map(sala => (
                    <Polygon key={sala.id} coordinates={sala.coordenadas}
                        fillColor={selectedSala?.id === sala.id ? 'rgba(29, 78, 216, 0.7)' : getSalaColor(sala)}
                        strokeColor="rgba(0,0,0,0.7)" strokeWidth={1.5} tappable onPress={() => handleSalaPress(sala)} 
                    />
                ))}
            </MapView>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onGoBack} style={styles.backButton}><MaterialIcons name="arrow-back" size={24} color="#374151" /></TouchableOpacity>
            </View>
            {/* <View style={styles.floorNavigatorContainer}>
                <TouchableOpacity style={styles.floorButton} onPress={() => Alert.alert("Próximamente", "Función para cambiar de piso no implementada.")}><Ionicons name="caret-up" size={24} color="#1F2937" /></TouchableOpacity>
                <Text style={styles.floorText}>Piso 5</Text>
                <TouchableOpacity style={styles.floorButton} onPress={() => Alert.alert("Próximamente", "Función para cambiar de piso no implementada.")}><Ionicons name="caret-down" size={24} color="#1F2937" /></TouchableOpacity>
            </View> */}
            {selectedSala && <SalaDetailCard sala={selectedSala} onClose={handleMapPress} />}
        </View>
    );
};

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
        flex: 1, // Permite que el título ocupe el espacio disponible
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
    statusAvailable: { color: '#10B981', fontWeight: 'bold' },
    statusWarning: { color: '#F59E0B', fontWeight: 'bold' },
    statusError: { color: '#EF4444', fontWeight: 'bold' },
    meterContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    meterBar: { width: 12, height: 16, borderRadius: 3 },
    meterText: { fontSize: 15, color: '#374151', fontWeight: '600', marginLeft: 8 },
    floorNavigatorContainer: { position: 'absolute', bottom: 25, left: 25, zIndex: 10, backgroundColor: 'white', borderRadius: 25, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, alignItems: 'center', paddingVertical: 5, },
    floorButton: { paddingHorizontal: 8, paddingVertical: 2, },
    floorText: { fontSize: 8, fontWeight: 'bold', color: '#1F2937', paddingVertical: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB', width: '100%', textAlign: 'center', },
});

export default Independencia1Map;
