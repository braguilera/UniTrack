import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Platform,
    Alert,
} from 'react-native';
import MapView, {
    PROVIDER_GOOGLE,
    Overlay, // CORREGIDO: MapOverlay ahora es Overlay
    Polygon,
    Polyline,
} from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

// --- Configuraciones iniciales ---
const planoInteriorImageSource = require('../assets/images/mapaIndep1-2.png');
const IMAGE_ASPECT_RATIO = 480 / 1200;
const MAP_MAIN_DIMENSION = 0.02;
const INITIAL_LATITUDE_DELTA = MAP_MAIN_DIMENSION * 1.5;
const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * IMAGE_ASPECT_RATIO;

const planoBounds = [
    [-MAP_MAIN_DIMENSION / 2, -(MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2],
    [MAP_MAIN_DIMENSION / 2, (MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2],
];

const initialMapRegion = {
    latitude: 0, longitude: 0,
    latitudeDelta: INITIAL_LATITUDE_DELTA, longitudeDelta: INITIAL_LONGITUDE_DELTA,
};
const customMapStyle = [ { elementType: 'geometry', stylers: [{ color: '#E0E0E0' }] }, { elementType: 'labels', stylers: [{ visibility: 'off' }] }, { featureType: 'administrative', stylers: [{ visibility: 'off' }] }, { featureType: 'poi', stylers: [{ visibility: 'off' }] }, { featureType: 'road', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }, { featureType: 'water', stylers: [{ color: '#E0E0E0' }] }, ];

// --- Constantes y Datos ---
const TAMANO_NODO_POLIGONO = 0.0001;
const SEGUNDOS_POR_UNIDAD_DE_PESO = 3.5;

const salas = [
    { id: 'Escalera1', nombre: 'Escalera', coordenadas: [ { latitude: 0.0003, longitude:   0.00025 }, { latitude: 0.0003, longitude:   0.00285 }, { latitude: -0.00136, longitude: 0.00285 }, { latitude: -0.00136, longitude: 0.00025 }, ], centro: { latitude: 0, longitude: -0.0025 }, color: 'rgba(87, 53, 3, 0.82)', },
    { id: 'Escalera2', nombre: 'Escalera', coordenadas: [ { latitude: 0.0100, longitude:   0.0006 }, { latitude: 0.0100, longitude:   0.004 }, { latitude: 0.0085, longitude:   0.004 }, { latitude: 0.0085, longitude:   0.0006 }, ], centro: { latitude: 0, longitude: -0.0025 }, color: 'rgba(87, 53, 3, 0.82)', },
    { id: 'Ascensor1', nombre: 'Ascensor', coordenadas: [ { latitude: 0.01, longitude: -0.00015 }, { latitude: 0.0089, longitude: -0.00015 }, { latitude: 0.0089, longitude: 0.0006  }, { latitude: 0.01, longitude:   0.0006 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(99, 15, 19, 0.66)', },
    { id: 'Ascensor2', nombre: 'Ascensor', coordenadas: [ { latitude: 0.01, longitude: -0.0008}, { latitude: 0.0089, longitude: -0.0008 }, { latitude: 0.0089, longitude: -0.00016  }, { latitude: 0.01, longitude:   -0.00016 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(99, 15, 19, 0.66)', },
    { id: 'Ascensor3', nombre: 'Ascensor', coordenadas: [ { latitude: -0.0032, longitude:   0.001 }, { latitude: -0.0032, longitude: 0.00193}, { latitude: -0.0042, longitude: 0.00193}, { latitude: -0.0042, longitude: 0.001}, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(99, 15, 19, 0.66)', },
    { id: 'Ascensor4', nombre: 'Ascensor', coordenadas: [ { latitude: -0.0032, longitude:   0.00195 }, { latitude: -0.0032, longitude: 0.0029 }, { latitude: -0.0042, longitude: 0.0029}, { latitude: -0.0042, longitude: 0.00195}, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(99, 15, 19, 0.66)', },
    { id: 'Baño1', nombre: 'Baño', coordenadas: [ { latitude: 0.01, longitude:   -0.00273 }, { latitude: 0.00846, longitude: -0.00273 }, { latitude: 0.00846, longitude: -0.00146 }, { latitude: 0.01, longitude:   -0.00146 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(15, 51, 4, 0.88)', },
    { id: 'Baño2', nombre: 'Baño', coordenadas: [ { latitude: 0.01, longitude:   -0.004 }, { latitude: 0.00846, longitude: -0.004 }, { latitude: 0.00846, longitude: -0.00275 }, { latitude: 0.01, longitude:   -0.00275 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(15, 51, 4, 0.88)', },
    { id: 'Comercio1', nombre: 'Comercio', coordenadas: [ { latitude: -0.0042, longitude: 0.00025 }, { latitude: -0.0042, longitude: 0.00285 }, { latitude: -0.00685, longitude: 0.00285 }, { latitude: -0.00685, longitude: 0.00025 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(207, 104, 168, 0.4)', },
    { id: 'Expendedora1', nombre: 'Expendedora', coordenadas: [ { latitude: -0.0069, longitude: 0.00025 }, { latitude: -0.0069, longitude: 0.00155 }, { latitude: -0.00735, longitude: 0.00155 }, { latitude: -0.00735, longitude: 0.00025 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(29, 37, 29, 0.14)', },
    { id: 'Limpieza1', nombre: 'Limpieza', coordenadas: [ { latitude: 0.01, longitude:   -0.00145 }, { latitude: 0.00846, longitude: -0.00145 }, { latitude: 0.00846, longitude: -0.0009 }, { latitude: 0.01, longitude:   -0.0009 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(155, 8, 135, 0.79)', },
    { id: 'Aula1', nombre: 'Aula', coordenadas: [ { latitude: 0.0078, longitude:   -0.00395 }, { latitude: 0.00405, longitude: -0.00395 }, { latitude: 0.00405, longitude: -0.0007 }, { latitude: 0.0078, longitude:   -0.0007 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', },
    { id: 'Aula2', nombre: 'Aula', coordenadas: [ { latitude: 0.004, longitude:   -0.0036 }, { latitude: 0.00038, longitude: -0.0036 }, { latitude: 0.00038, longitude: -0.00085 }, { latitude: 0.004, longitude:   -0.00085 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', },
    { id: 'Aula3', nombre: 'Aula', coordenadas: [ { latitude: 0.00033, longitude:   -0.0036 }, { latitude: -0.00365, longitude: -0.0036 }, { latitude: -0.00365, longitude: -0.00085 }, { latitude: 0.00033, longitude:   -0.00085 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', },
    { id: 'Aula4', nombre: 'Aula', coordenadas: [ { latitude: -0.0037, longitude:   -0.0036 }, { latitude: -0.00685, longitude: -0.0036 }, { latitude: -0.00685, longitude: -0.00085 }, { latitude: -0.0037, longitude:   -0.00085 }, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', },
    { id: 'Aula5', nombre: 'Aula', coordenadas: [ { latitude: -0.01, longitude: -0.0036 }, { latitude: -0.01, longitude:  0.00027 }, { latitude: -0.0085, longitude:  0.00027 }, { latitude:  -0.0085, longitude:  -0.00085 }, { latitude:  -0.0069, longitude:  -0.00085}, { latitude:  -0.0069, longitude: -0.0036} ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', },
    { id: 'Aula6', nombre: 'Aula', coordenadas: [ { latitude:  0.00405, longitude:  0.00009 }, { latitude:  0.00405, longitude:  0.004 }, { latitude:  0.0078, longitude:  0.004 }, { latitude:  0.0078, longitude:  0.0012 }, { latitude:  0.00735, longitude:  0.0012 }, { latitude:  0.00735, longitude:  0.00009 } ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', },
    { id: 'Aula7', nombre: 'Aula', coordenadas: [ { latitude: 0.004, longitude:   0.0003 }, { latitude: 0.00038, longitude: 0.0003 }, { latitude: 0.00038, longitude:  0.00285 }, { latitude: 0.004, longitude:   0.00285}, ], centro: { latitude: 0, longitude: 0.0045 }, color: 'rgba(78, 188, 240, 0.73)', },
];

const nodosDelCamino = [
    { id: 'Baño de Mujeres', coordenada: { latitude: 0.0085, longitude: -0.0032 } },
    { id: 'Baño de Hombres', coordenada: { latitude: 0.0085, longitude: -0.0023 } },
    { id: 'Limpieza', coordenada: { latitude: 0.0085, longitude: -0.00121 } },
    { id: 'Escalera Indep2', coordenada: { latitude: 0.00854, longitude: 0.0015 } },
    { id: 'Ascensor Indep2', coordenada: { latitude: 0.008879117632134888, longitude: -0.0002801887011528015 } },
    { id: 'Aula 547', coordenada: { latitude: 0.00467554385900846, longitude: -0.0006979721856117249 } },
    { id: 'Aula 548', coordenada: { latitude: 0.00467554385900846, longitude: 0.00015 } },
    { id: 'Aula 545', coordenada: { latitude: 0.0008522719144590833, longitude: -0.000848231291770935 } },
    { id: 'Aula 546', coordenada: { latitude: 0.0008522719144590833, longitude: 0.00028 } },
    { id: 'Ascensor Indep1', coordenada: { latitude: -0.00322, longitude: 0.00194 } },
    { id: 'Escalera Indep1', coordenada: { latitude: -0.00137, longitude: 0.0013525038957595825 } },
    { id: 'Comercio', coordenada: { latitude: -0.00685, longitude: 0.0019144266843795774 } },
    { id: 'Expendedora', coordenada: { latitude: -0.007302, longitude: 0.0007272139191627502 } },
    { id: 'Aula 544', coordenada: { latitude: -0.003328956661731847, longitude: -0.0008488 } },
    { id: 'Aula 543', coordenada: { latitude: -0.006778947993196767, longitude: -0.0008488 } },
    { id: 'Aula 542', coordenada: { latitude: -0.007302, longitude: -0.0008488 } },
    { id: 'nodoConexion18', coordenada: { latitude: -0.003328956661731847, longitude: -0.0002801887011528015 } },
    { id: 'nodoConexion19', coordenada: { latitude: -0.0018755346533251007, longitude: -0.0002801887011528015 } },
    { id: 'nodoConexion21', coordenada: { latitude: 0.0008522719144590833, longitude: -0.0002801887011528015 } },
    { id: 'nodoConexion23', coordenada: { latitude: -0.007302, longitude: -0.0002801887011528015} },
    { id: 'nodoConexion25', coordenada: { latitude: 0.008134804638720128, longitude: -0.00121 } },
    { id: 'nodoConexion26', coordenada: { latitude: 0.008134804638720128, longitude: -0.0023 } },
    { id: 'nodoConexion27', coordenada: { latitude: 0.008134804638720128, longitude:  -0.0032 } },
    { id: 'nodoConexion29', coordenada: { latitude: 0.008134804638720128, longitude: 0.0015   } },
    { id: 'nodoConexion30', coordenada: { latitude: -0.008138827952189035, longitude: -0.0002801887011528015 } },
    { id: 'nodoConexion31', coordenada: { latitude: -0.008138827952189035, longitude: 0.00073 } },
    { id: 'nodoConexion32', coordenada: { latitude: -0.008138827952189035, longitude: 0.00191} },
    { id: 'nodoConexion33', coordenada: { latitude: 0.00467554385900846, longitude: -0.0002801887011528015 } },
    { id: 'nodoConexion34', coordenada: { latitude: 0.008134804638720128, longitude:-0.0002801887011528015 } },
    { id: 'nodoConexion35', coordenada: { latitude: -0.0018755346533251007, longitude: 0.0013525038957595825 } },
    { id: 'nodoConexion36', coordenada: { latitude: -0.0018755346533251007, longitude: 0.00194 } },
    { id: 'nodoConexion37', coordenada: { latitude: -0.006778947993196767, longitude: -0.0002801887011528015 } },
];

// --- Funciones Auxiliares ---
const generarCoordenadasNodoPoligono = (centro, tamano) => {
    const medioTamano = tamano / 2;
    return [ { latitude: centro.latitude - medioTamano, longitude: centro.longitude - medioTamano }, { latitude: centro.latitude + medioTamano, longitude: centro.longitude - medioTamano }, { latitude: centro.latitude + medioTamano, longitude: centro.longitude + medioTamano }, { latitude: centro.latitude - medioTamano, longitude: centro.longitude + medioTamano }, ];
};

const formatSecondsToMinutesAndSeconds = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "N/A";
    }
    const minutos = Math.floor(totalSeconds / 60);
    const segundos = Math.round(totalSeconds % 60);
    return `${minutos} min ${segundos} seg`;
};

const conexionesBase = {
    'nodoConexion32': ['nodoConexion31', 'Comercio'],
    'nodoConexion31': ['nodoConexion30', 'Expendedora'],
    'nodoConexion30': ['nodoConexion23'],
    'nodoConexion23': ['Aula 542', 'nodoConexion37'],
    'nodoConexion18': ['Aula 544','nodoConexion19'],
    'nodoConexion19': ['nodoConexion35','nodoConexion21'],
    'nodoConexion35': ['Escalera Indep1','nodoConexion36'],
    'nodoConexion21': ['Aula 546','Aula 545','nodoConexion33'],
    'nodoConexion33': ['Aula 548','Aula 547','nodoConexion34'],
    'nodoConexion34': ['nodoConexion29','Ascensor Indep2','nodoConexion25'],
    'nodoConexion25': ['Limpieza','nodoConexion26'],
    'nodoConexion26': ['Baño de Hombres','nodoConexion27'],
    'nodoConexion27': ['Baño de Mujeres'],
    'nodoConexion29': ['Escalera Indep2'],
    'nodoConexion36': ['Ascensor Indep1'],
    'nodoConexion37': ['Aula 543','nodoConexion18'],
    'Baño de Mujeres': [], 'Baño de Hombres': [], 'Limpieza': [], 'Escalera Indep2': [],
    'Ascensor Indep2': [], 'Aula 547': [], 'Aula 548': [], 'Aula 545': [], 'Aula 546': [],
    'Ascensor Indep1': [], 'Escalera Indep1': [], 'Comercio': [], 'Expendedora': [],
    'Aula 544': [], 'Aula 543': [], 'Aula 542': [],
};

const conexionesNodosPonderadas = {};
const generarPesoAleatorio = () => parseFloat((Math.random() * 4 + 1).toFixed(1));

for (const nodoId in conexionesBase) {
    if (!conexionesNodosPonderadas[nodoId]) conexionesNodosPonderadas[nodoId] = [];
    if (nodosDelCamino.find(n => n.id === nodoId)) {
        conexionesBase[nodoId].forEach(vecinoId => {
            if (nodosDelCamino.find(n => n.id === vecinoId)) {
                conexionesNodosPonderadas[nodoId].push({ idVecino: vecinoId, peso: generarPesoAleatorio() });
            }
        });
    }
}
Object.keys(conexionesNodosPonderadas).forEach(nodoId => {
    if(conexionesNodosPonderadas[nodoId]){
        conexionesNodosPonderadas[nodoId].forEach(conexion => {
            const { idVecino, peso } = conexion;
            if (nodosDelCamino.find(n => n.id === idVecino)) {
                if (!conexionesNodosPonderadas[idVecino]) conexionesNodosPonderadas[idVecino] = [];
                if (!conexionesNodosPonderadas[idVecino].find(c => c.idVecino === nodoId)) {
                    conexionesNodosPonderadas[idVecino].push({ idVecino: nodoId, peso: peso });
                }
            }
        });
    }
});

const encontrarCaminoDijkstra = (
    inicioId,
    finId,
    grafo,
    todosLosNodos
) => {
    const distancias = {};
    const previos = {};
    const cola = [];
    const nodosMap = new Map(todosLosNodos.map(n => [n.id, n]));

    for (const nodo of todosLosNodos) {
        distancias[nodo.id] = Infinity;
        previos[nodo.id] = null;
    }

    if (!nodosMap.has(inicioId) || !nodosMap.has(finId)) {
        return { camino: [], pesoTotal: null };
    }

    distancias[inicioId] = 0;
    cola.push({ id: inicioId, pesoTotal: 0 });

    while (cola.length > 0) {
        cola.sort((a, b) => a.pesoTotal - b.pesoTotal);
        const { id: actualId, pesoTotal: pesoActual } = cola.shift();

        if (actualId === finId && distancias[actualId] !== Infinity) break;
        if (pesoActual > distancias[actualId]) continue;

        const vecinos = grafo[actualId] || [];
        for (const conexionVecino of vecinos) {
            const { idVecino, peso: pesoArista } = conexionVecino;
            if (!nodosMap.has(idVecino)) {
                continue;
            }

            const nuevoPesoAcumulado = distancias[actualId] + pesoArista;
            if (nuevoPesoAcumulado < distancias[idVecino]) {
                distancias[idVecino] = nuevoPesoAcumulado;
                previos[idVecino] = actualId;
                cola.push({ id: idVecino, pesoTotal: nuevoPesoAcumulado });
            }
        }
    }

    const caminoCoords = [];
    let tempFinId = finId;
    if (distancias[tempFinId] === Infinity) {
        return { camino: [], pesoTotal: null };
    }

    while (tempFinId) {
        const nodoActual = nodosMap.get(tempFinId);
        if (nodoActual) caminoCoords.unshift(nodoActual.coordenada);
        else return { camino: [], pesoTotal: null };
        if (tempFinId === inicioId) break;
        tempFinId = previos[tempFinId];
        if (!tempFinId && caminoCoords.length > 0 && (caminoCoords[0] !== nodosMap.get(inicioId)?.coordenada)) {
             return { camino: [], pesoTotal: null };
        }
    }
    return { camino: caminoCoords, pesoTotal: distancias[finId] };
};


const IndoorMapScreen = () => {
    const [selectedSala, setSelectedSala] = useState(null);
    const mapRef = useRef(null);
    const [selectedNodoInicioId, setSelectedNodoInicioId] = useState(null);
    const [selectedNodoFinId, setSelectedNodoFinId] = useState(null);
    const [rutaCalculadaCoordenadas, setRutaCalculadaCoordenadas] = useState([]);
    const [pesoTotalRuta, setPesoTotalRuta] = useState(null);
    const [tiempoEstimadoFormateado, setTiempoEstimadoFormateado] = useState(null);
    const [lineasDeConexiones, setLineasDeConexiones] = useState([]);
    const nodosMapRef = useRef(new Map(nodosDelCamino.map(n => [n.id, n.coordenada])));

    const nodosImportantes = nodosDelCamino
        .filter(nodo => !nodo.id.toLowerCase().includes("nodoconexion"))
        .sort((a, b) => a.id.localeCompare(b.id));

    useEffect(() => {
        const nuevasLineas = [];
        const paresProcesados = new Set();
        const nodosMap = nodosMapRef.current;
        for (const nodoIdBase in conexionesNodosPonderadas) {
            if (nodosMap.has(nodoIdBase) && conexionesNodosPonderadas[nodoIdBase]) {
                const coordBase = nodosMap.get(nodoIdBase);
                conexionesNodosPonderadas[nodoIdBase].forEach(conexion => {
                    if (nodosMap.has(conexion.idVecino)) {
                        const parKey = [nodoIdBase, conexion.idVecino].sort().join('-');
                        if (!paresProcesados.has(parKey)) {
                            nuevasLineas.push([coordBase, nodosMap.get(conexion.idVecino)]);
                            paresProcesados.add(parKey);
                        }
                    }
                });
            }
        }
        setLineasDeConexiones(nuevasLineas);
    }, []);

    useEffect(() => {
        if (selectedNodoInicioId && selectedNodoFinId) {
            try {
                const resultadoRuta = encontrarCaminoDijkstra(
                    selectedNodoInicioId,
                    selectedNodoFinId,
                    conexionesNodosPonderadas,
                    nodosDelCamino
                );
                setRutaCalculadaCoordenadas(resultadoRuta.camino);
                setPesoTotalRuta(resultadoRuta.pesoTotal);

                if (resultadoRuta.pesoTotal !== null && resultadoRuta.camino.length > 0) {
                    const tiempoEnSegundos = resultadoRuta.pesoTotal * SEGUNDOS_POR_UNIDAD_DE_PESO;
                    setTiempoEstimadoFormateado(formatSecondsToMinutesAndSeconds(tiempoEnSegundos));
                } else {
                    setTiempoEstimadoFormateado(null);
                }

                if (resultadoRuta.camino.length === 0 && selectedNodoInicioId !== selectedNodoFinId) {
                    Alert.alert("Ruta no encontrada", "No se pudo encontrar un camino entre los nodos seleccionados.");
                }
            } catch (error) {
                console.error("Error al calcular la ruta Dijkstra:", error);
                Alert.alert("Error", "Ocurrió un error al calcular la ruta.");
                setRutaCalculadaCoordenadas([]);
                setPesoTotalRuta(null);
                setTiempoEstimadoFormateado(null);
            }
        } else {
            setRutaCalculadaCoordenadas([]);
            setPesoTotalRuta(null);
            setTiempoEstimadoFormateado(null);
        }
    }, [selectedNodoInicioId, selectedNodoFinId]);

    const handleMapPress = (event) => {
        const coords = event.nativeEvent.coordinate;
        console.log(`Mapa presionado en: Lat ${coords.latitude}, Lng ${coords.longitude}`);
        setSelectedSala(null);
    };

    const handleSalaPress = (sala) => {
        setSelectedSala(sala);
        Alert.alert('Sala Seleccionada', sala.nombre);
        if (sala.centro && mapRef.current) {
            mapRef.current.animateToRegion(
                { ...sala.centro, latitudeDelta: MAP_MAIN_DIMENSION / 4, longitudeDelta: (MAP_MAIN_DIMENSION / 4) * IMAGE_ASPECT_RATIO, }, 1000
            );
        }
    };

    const handlePickerInicioChange = (itemValue) => {
        if (itemValue && itemValue !== selectedNodoFinId) {
            setSelectedNodoInicioId(itemValue);
        } else if (itemValue === null) {
            setSelectedNodoInicioId(null);
        } else if (itemValue === selectedNodoFinId) {
            Alert.alert("Aviso", "El origen no puede ser igual al destino.");
        }
    };

    const handlePickerFinChange = (itemValue) => {
        if (itemValue && itemValue !== selectedNodoInicioId) {
            setSelectedNodoFinId(itemValue);
        } else if (itemValue === null) {
            setSelectedNodoFinId(null);
        } else if (itemValue === selectedNodoInicioId) {
            Alert.alert("Aviso", "El destino no puede ser igual al origen.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.pickerContainer}>
                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Desde:</Text>
                    <Picker selectedValue={selectedNodoInicioId} style={styles.picker} onValueChange={handlePickerInicioChange} prompt="Selecciona un punto de origen" >
                        <Picker.Item label="-- Seleccionar Origen --" value={null} style={styles.pickerItemInitial} />
                        {nodosImportantes.map((nodo) => ( <Picker.Item key={`inicio-${nodo.id}`} label={nodo.id} value={nodo.id} style={styles.pickerItem} /> ))}
                    </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                    <Text style={styles.pickerLabel}>Hasta:</Text>
                    <Picker selectedValue={selectedNodoFinId} style={styles.picker} onValueChange={handlePickerFinChange} prompt="Selecciona un punto de destino" >
                        <Picker.Item label="-- Seleccionar Destino --" value={null} style={styles.pickerItemInitial} />
                        {nodosImportantes.map((nodo) => ( <Picker.Item key={`fin-${nodo.id}`} label={nodo.id} value={nodo.id} style={styles.pickerItem}/> ))}
                    </Picker>
                </View>

                {selectedNodoInicioId && selectedNodoFinId && (
                    <View style={styles.rutaInfoContainer}>
                        {rutaCalculadaCoordenadas.length > 0 && pesoTotalRuta !== null ? (
                            <>
                                <View style={styles.rutaInfoItem}>
                                    <Text style={styles.rutaInfoLabel}>Distancia Estimada:</Text>
                                    <Text style={styles.rutaInfoValor}>{pesoTotalRuta.toFixed(1)} metros</Text>
                                </View>
                                {tiempoEstimadoFormateado && (
                                     <View style={styles.rutaInfoItem}>
                                         <Text style={styles.rutaInfoLabel}>Tiempo Estimado:</Text>
                                         <Text style={styles.rutaInfoValor}>{tiempoEstimadoFormateado}</Text>
                                     </View>
                                )}
                            </>
                        ) : (
                            (pesoTotalRuta === null || rutaCalculadaCoordenadas.length === 0 ) && (
                                <View style={styles.rutaInfoItem}>
                                     <Text style={styles.rutaInfoError}>Ruta no disponible.</Text>
                                </View>
                            )
                        )}
                    </View>
                )}
            </View>

            <MapView
                ref={mapRef}
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={initialMapRegion}
                customMapStyle={customMapStyle}
                mapType={Platform.OS === 'android' ? 'none' : 'standard'}
                onPress={handleMapPress}
                minZoomLevel={15}
                maxZoomLevel={20}
                showsPointsOfInterest={false}
                showsBuildings={false}
                showsTraffic={false}
                showsUserLocation={false}
            >
                {/* CORREGIDO: Se usa Overlay en lugar de MapOverlay */}
                {planoInteriorImageSource && ( <Overlay image={planoInteriorImageSource} bounds={planoBounds} opacity={1}/> )}
                
                {salas.map(sala => ( <Polygon key={sala.id} coordinates={sala.coordenadas} fillColor={selectedSala?.id === sala.id ? 'rgba(255,0,0,0.6)' : sala.color} strokeColor="rgba(0,0,0,0.7)" strokeWidth={1.5} tappable onPress={() => handleSalaPress(sala)} zIndex={1}/> ))}
                
                {nodosDelCamino.map(nodo => {
                    let fillColor = 'rgba(100, 100, 255, 0)';
                    if (selectedNodoInicioId === nodo.id) fillColor = 'rgba(0,255,0,0.9)';
                    else if (selectedNodoFinId === nodo.id) fillColor = 'rgba(255,165,0,0.9)';
                    return ( <Polygon key={`nodo-poly-${nodo.id}`} coordinates={generarCoordenadasNodoPoligono(nodo.coordenada, TAMANO_NODO_POLIGONO)} fillColor={fillColor} strokeColor="rgba(0,0,100,0.8)" strokeWidth={0.1 * TAMANO_NODO_POLIGONO} zIndex={2} /> );
                })}
                
                {rutaCalculadaCoordenadas.length > 1 && ( <Polyline coordinates={rutaCalculadaCoordenadas} strokeColor="#FF007F" strokeWidth={5} lineCap="round" zIndex={3}/> )}
            </MapView>

            {selectedSala && ( <View style={styles.infoBox}> <Text style={styles.infoTextTitle}>Información:</Text> <Text style={styles.infoText}>{selectedSala.nombre}</Text> </View> )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { ...StyleSheet.absoluteFillObject, alignItems: 'center', },
    map: { ...StyleSheet.absoluteFillObject, zIndex: 0, },
    infoBox: { position: 'absolute', bottom: Platform.OS === 'ios' ? 30 : 20, left: 20, right: 20, backgroundColor: 'white', borderRadius: 10, padding: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, zIndex: 10, },
    infoTextTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, },
    infoText: { fontSize: 14, },
    pickerContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 10,
        right: 10,
        zIndex: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    pickerWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
        paddingVertical: Platform.OS === 'ios' ? 2 : 0,
        marginBottom: 2,
    },
    pickerLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
        marginLeft: Platform.OS === 'android' ? 4 : 2,
        marginBottom: Platform.OS === 'android' ? -12 : (Platform.OS === 'ios' ? -5 : 0),
        marginTop: Platform.OS === 'ios' ? 5 : 0,
    },
    picker: {
        height: Platform.OS === 'ios' ? 40 : 55,
        width: '100%',
    },
    pickerItemInitial: {
        color: Platform.OS === 'android' ? '#888' : '#777',
        fontSize: Platform.OS === 'android' ? 16 : 17,
    },
    pickerItem: {
        fontSize: Platform.OS === 'android' ? 16 : 18,
        color: '#000000',
    },
    rutaInfoContainer: {
        marginTop: 8,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    rutaInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        marginBottom: 3,
    },
    rutaInfoLabel: {
        fontSize: 13,
        color: '#444',
        fontWeight: '500',
    },
    rutaInfoValor: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    rutaInfoError: {
        fontSize: 13,
        color: '#D32F2F',
        fontStyle: 'italic',
        textAlign: 'center',
    }
});

export default IndoorMapScreen;