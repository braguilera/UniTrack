import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Overlay, Polygon } from 'react-native-maps';

const Independencia1Map = ({ onGoBack }) => {
    const planoInteriorImageSource = require('../assets/images/MapaIND1.png');
    const IMAGE_ASPECT_RATIO = 480 / 1200;
    const MAP_MAIN_DIMENSION = 0.02;
    const INITIAL_LATITUDE_DELTA = MAP_MAIN_DIMENSION * 1.5;
    const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * IMAGE_ASPECT_RATIO;
    const planoBounds = [[-MAP_MAIN_DIMENSION / 2, -(MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2], [MAP_MAIN_DIMENSION / 2, (MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2]];
    const initialMapRegion = { latitude: 0, longitude: 0, latitudeDelta: INITIAL_LATITUDE_DELTA, longitudeDelta: INITIAL_LONGITUDE_DELTA };
    const customMapStyle = [ { elementType: 'geometry', stylers: [{ color: '#F5F5F5' }] }, { elementType: 'labels', stylers: [{ visibility: 'off' }] }, { featureType: 'administrative', stylers: [{ visibility: 'off' }] }, { featureType: 'poi', stylers: [{ visibility: 'off' }] }, { featureType: 'road', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }, { featureType: 'water', stylers: [{ color: '#FFFFFF' }] }, ];
    
    const salas = [ { id: 'Escalera2', nombre: 'Escalera', coordenadas: [ { latitude: 0.0047, longitude:  0.0008 }, { latitude: 0.0047, longitude:  0.004 }, { latitude: 0.0022, longitude:  0.004 }, { latitude: 0.0022, longitude:  0.0008 }, ], centro: { latitude: 0, longitude: -0.0025 }, color: 'rgba(87, 53, 3, 0.82)', }, { id: 'Ascensor3', nombre: 'Ascensor', coordenadas: [ { latitude:  -0.0003, longitude:  0.00165 }, { latitude: -0.0003, longitude: 0.0028}, { latitude: -0.00175, longitude: 0.0028}, { latitude: -0.00175, longitude: 0.00165}, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(99, 15, 19, 0.66)', }, { id: 'Ascensor4', nombre: 'Ascensor', coordenadas: [ { latitude: -0.0003, longitude:  0.0028 }, { latitude: -0.0003, longitude: 0.004}, { latitude: -0.00175, longitude: 0.004}, { latitude: -0.00175, longitude: 0.0028}, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(99, 15, 19, 0.66)', }, { id: 'Comercio1', nombre: 'Comercio', coordenadas: [ { latitude: -0.00175, longitude: 0.0008 }, { latitude: -0.00175, longitude: 0.004 }, { latitude: -0.0055, longitude: 0.004 }, { latitude: -0.0055, longitude: 0.0008 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(207, 104, 168, 0.4)', }, { id: 'Expendedora1', nombre: 'Expendedora', coordenadas: [ { latitude: -0.00555, longitude: 0.00075 }, { latitude: -0.00555, longitude: 0.00233}, { latitude: -0.00625, longitude: 0.00233 }, { latitude: -0.00625, longitude: 0.00075 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(29, 37, 29, 0.14)', }, { id: 'Aula5', nombre: 'Aula', coordenadas: [ { latitude: -0.01, longitude: -0.0039 }, { latitude: -0.01, longitude:  0.0008 }, { latitude: -0.0078, longitude:  0.0008 }, { latitude:  -0.0078, longitude:  -0.00058 }, { latitude:  -0.00555, longitude:  -0.00058}, { latitude:  -0.00555, longitude: -0.0039} ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', }, { id: 'Aula4', nombre: 'Aula', coordenadas: [ { latitude: -0.00095, longitude:   -0.0039 }, { latitude: -0.0055, longitude: -0.0039 }, { latitude: -0.0055, longitude: -0.0006 }, { latitude: -0.00095, longitude:   -0.0006 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', }, { id: 'Aula3', nombre: 'Aula', coordenadas: [ { latitude:  0.00475, longitude:   -0.0039 }, { latitude: -0.00093, longitude: -0.0039 }, { latitude: -0.00093, longitude: -0.0006 }, { latitude:  0.00475, longitude:   -0.0006 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', }, { id: 'Aula2', nombre: 'Aula', coordenadas: [ { latitude: 0.0099, longitude:   -0.0039 }, { latitude: 0.00475, longitude: -0.0039 }, { latitude: 0.00475, longitude: -0.0006 }, { latitude: 0.0099, longitude:   -0.0006 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', }, { id: 'Aula1', nombre: 'Aula', coordenadas: [ { latitude: 0.0099, longitude:   0.0039 }, { latitude: 0.00475, longitude: 0.0039 }, { latitude: 0.00475, longitude: 0.00075 }, { latitude: 0.0099, longitude:   0.00075 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', }, ];

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <MapView style={StyleSheet.absoluteFillObject} provider={PROVIDER_GOOGLE} initialRegion={initialMapRegion} customMapStyle={customMapStyle} minZoomLevel={15} maxZoomLevel={20}>
                {planoInteriorImageSource && <Overlay image={planoInteriorImageSource} bounds={planoBounds} opacity={1} />}
                {salas.map(sala => <Polygon key={sala.id} coordinates={sala.coordenadas} fillColor={sala.color} strokeColor="rgba(0,0,0,0.7)" strokeWidth={1.5} tappable onPress={() => Alert.alert('Sala Seleccionada', sala.nombre)} />)}
            </MapView>
            <TouchableOpacity onPress={onGoBack} className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg">
                <MaterialIcons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
        </View>
    );
};

export default Independencia1Map;
