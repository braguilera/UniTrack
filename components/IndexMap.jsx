import React, { useState, useRef } from 'react';
import { StyleSheet, Platform, Alert, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Overlay, Polygon } from 'react-native-maps';

const IndexMap = ({ onSelectBuilding }) => {
    const mapRef = useRef(null);
    const [selectedSala, setSelectedSala] = useState(null);

    const planoInteriorImageSource = require('../assets/images/plano_edificio.png');
    const IMAGE_ASPECT_RATIO = 720 / 1200;
    const MAP_MAIN_DIMENSION = 0.02;
    const INITIAL_LATITUDE_DELTA = MAP_MAIN_DIMENSION * 1.5;
    const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * IMAGE_ASPECT_RATIO;

    const planoBounds = [
        [-MAP_MAIN_DIMENSION / 2, -(MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2],
        [MAP_MAIN_DIMENSION / 2, (MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2],
    ];

    const initialMapRegion = {
        latitude: 0,
        longitude: 0,
        latitudeDelta: INITIAL_LATITUDE_DELTA,
        longitudeDelta: INITIAL_LONGITUDE_DELTA,
    };

    // CAMBIO: Fondo del mapa a blanco
    const customMapStyle = [ { elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] }, { elementType: 'labels', stylers: [{ visibility: 'off' }] }, { featureType: 'administrative', stylers: [{ visibility: 'off' }] }, { featureType: 'poi', stylers: [{ visibility: 'off' }] }, { featureType: 'road', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }, { featureType: 'water', stylers: [{ color: '#FFFFFF' }] }, ];


    const salas = [
        { id: 'Independencia2', nombre: 'Independencia 2', coordenadas: [{ latitude: 0.0005, longitude: -0.006 }, { latitude: -0.0015, longitude: -0.006 }, { latitude: -0.0015, longitude: -0.0003 }, { latitude: 0.0005, longitude: -0.0003 }, ], color: 'rgba(78, 188, 240, 0.73)' },
        { id: "Independencia1", nombre: "Independencia 1", coordenadas: [{ latitude: -0.0071, longitude: -0.006 }, { latitude: -0.0071, longitude: -0.0048 }, { latitude: -0.0061, longitude: -0.0047 }, { latitude: -0.0061, longitude: -0.0039 }, { latitude: -0.0044, longitude: -0.0039 }, { latitude: -0.0044, longitude: -0.0014 }, { latitude: -0.0015781447289326441, longitude: -0.0014 }, { latitude: -0.0015781447289326441, longitude: -0.005958862602710724 }, ], color: 'rgba(59, 130, 246, 0.7)' },
    ];

    const handleSalaPress = (sala) => {
        setSelectedSala(sala);
        if (sala.id === 'Independencia1' || sala.id === 'Independencia2') {
            onSelectBuilding(sala.id.toLowerCase());
        } else {
            Alert.alert('Sala Seleccionada', sala.nombre);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={initialMapRegion}
                customMapStyle={customMapStyle}
                mapType={'standard'}
                minZoomLevel={14.5} maxZoomLevel={16}
                showsPointsOfInterest={false} showsBuildings={false}
                rotateEnabled={false}
                pitchEnabled={false}
            >
                {planoInteriorImageSource && (<Overlay image={planoInteriorImageSource} bounds={planoBounds} opacity={0.9} />)}
                {salas.map(sala => (
                    <Polygon
                        key={sala.id}
                        coordinates={sala.coordenadas}
                        fillColor={selectedSala?.id === sala.id ? 'rgba(29, 78, 216, 0.7)' : sala.color}
                        strokeColor="rgba(0,0,0,0.6)"
                        strokeWidth={1.5}
                        tappable
                        onPress={() => handleSalaPress(sala)}
                    />
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Fondo general blanco
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    titleContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        overflow: 'hidden', // Para que el borde redondeado se aplique al fondo
    },
});

export default IndexMap;