import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { PROVIDER_GOOGLE, Overlay, Polygon } from 'react-native-maps';

const Independencia2Map = ({ onGoBack }) => {
    const planoInteriorImageSource = require('../assets/images/MapaIND2.png');
    const IMAGE_ASPECT_RATIO = 720 / 1200;
    const MAP_MAIN_DIMENSION = 0.02;
    const INITIAL_LATITUDE_DELTA = MAP_MAIN_DIMENSION * 1.5;
    const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * IMAGE_ASPECT_RATIO;
    const planoBounds = [[-MAP_MAIN_DIMENSION / 2, -(MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2], [MAP_MAIN_DIMENSION / 2, (MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2]];
    const initialMapRegion = { latitude: 0, longitude: 0, latitudeDelta: INITIAL_LATITUDE_DELTA, longitudeDelta: INITIAL_LONGITUDE_DELTA };
    const customMapStyle = [ { elementType: 'geometry', stylers: [{ color: '#F5F5F5' }] }, { elementType: 'labels', stylers: [{ visibility: 'off' }] }, { featureType: 'administrative', stylers: [{ visibility: 'off' }] }, { featureType: 'poi', stylers: [{ visibility: 'off' }] }, { featureType: 'road', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }, { featureType: 'water', stylers: [{ color: '#FFFFFF' }] }, ];
    
    const salas = [ { id: 'Escalera1', nombre: 'Escalera', coordenadas: [ { latitude: 0.0099, longitude:  0.0059 },{ latitude: 0.0099, longitude: 0.0009 },{ latitude: 0.0052, longitude: 0.0009 },{ latitude: 0.0052, longitude: 0.0059 }, ], centro: { latitude: 0, longitude: -0.0025 }, color: 'rgba(87, 53, 3, 0.82)', }, { id: 'Ascensor1', nombre: 'Ascensor', coordenadas: [ { latitude: 0.01, longitude: -0.0002 }, { latitude: 0.0065, longitude: -0.0002 }, { latitude: 0.0065, longitude: 0.0008  }, { latitude: 0.01, longitude:   0.0008 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(99, 15, 19, 0.66)', }, { id: 'Ascensor2', nombre: 'Ascensor', coordenadas: [ { latitude: 0.01, longitude: -0.0013}, { latitude: 0.0065, longitude: -0.0013 }, { latitude: 0.0065, longitude: -0.00025  }, { latitude: 0.01, longitude:   -0.00025 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(99, 15, 19, 0.66)', }, { id: 'Aula6', nombre: 'Aula', coordenadas: [ { latitude:  -0.01, longitude:  0.0001 }, { latitude:  -0.01, longitude:  0.0059 }, { latitude:  0.0028, longitude:  0.0059 }, { latitude:  0.0028, longitude:  0.0018 }, { latitude:  0.00135, longitude:  0.0018 }, { latitude:  0.00135, longitude:  0.0001 } ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', }, { id: 'Aula7', nombre: 'Aula', coordenadas: [ { latitude: 0.0027, longitude: -0.006 }, { latitude: -0.01, longitude:  -0.006 }, { latitude: -0.01, longitude:  -0.001 }, { latitude: 0.0027, longitude: -0.001}, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', }, { id: 'Limpieza1', nombre: 'Limpieza', coordenadas: [ { latitude: 0.01, longitude:   -0.00223 }, { latitude: 0.0049, longitude: -0.00223 }, { latitude: 0.0049, longitude: -0.0013 }, { latitude: 0.01, longitude:   -0.0013 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(155, 8, 135, 0.79)', }, { id: 'Baños1', nombre: 'Baño', coordenadas: [ { latitude: 0.01, longitude:   -0.0041 }, { latitude: 0.0049, longitude: -0.0041 }, { latitude: 0.0049, longitude: -0.00223 }, { latitude: 0.01, longitude:   -0.00223 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(15, 51, 4, 0.88)', }, { id: 'Baños2', nombre: 'Baño', coordenadas: [ { latitude: 0.01, longitude:   -0.006 }, { latitude: 0.0049, longitude: -0.006 }, { latitude: 0.0049, longitude: -0.0041 }, { latitude: 0.01, longitude:   -0.0041 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(15, 51, 4, 0.88)', }, ];

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

export default Independencia2Map;