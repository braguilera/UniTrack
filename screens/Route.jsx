"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Alert,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native"
import MapView, { PROVIDER_GOOGLE, Overlay, Polygon, Polyline } from "react-native-maps"
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { useBLEContext } from "../services/BLEProvider"

// --- LÓGICA DE COLORES Y CONSTANTES (SIN CAMBIOS) ---
const colorModes = new Map()
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
  mantenimiento: "rgba(46, 204, 113, 0.7)",
  Default: "rgba(200, 200, 200, 0.5)",
}
colorModes.set("modoConcurrencia", modoConcurrenciaColores)

const planoInteriorImageSource = require("../assets/images/mapaIndep1-2.png")
const IMAGE_ASPECT_RATIO = 480 / 1200
const MAP_MAIN_DIMENSION = 0.02
const INITIAL_LATITUDE_DELTA = MAP_MAIN_DIMENSION * 1.5
const INITIAL_LONGITUDE_DELTA = INITIAL_LATITUDE_DELTA * IMAGE_ASPECT_RATIO
const planoBounds = [
  [-MAP_MAIN_DIMENSION / 2, -(MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2],
  [MAP_MAIN_DIMENSION / 2, (MAP_MAIN_DIMENSION * IMAGE_ASPECT_RATIO) / 2],
]
const initialMapRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: INITIAL_LATITUDE_DELTA,
  longitudeDelta: INITIAL_LONGITUDE_DELTA,
}
const customMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#FFFFFF" }] },
  { elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", stylers: [{ color: "#FFFFFF" }] },
]
const TAMANO_NODO_POLIGONO = 0.0001
const SEGUNDOS_POR_UNIDAD_DE_PESO = 3.5

// [Aquí van todos los datos de salas, nodos y conexiones - sin cambios]
const salasIniciales = [
  {
    id: "Escalera Indep1",
    tipo: "estructura",
    concurrencia: "Baja",
    nombre: "Escaleras\nEdificio: Independencia 1\nPiso: 5\nConecta pisos: 1-8\n",
    coordenadas: [
      { latitude: 0.0003, longitude: 0.00025 },
      { latitude: 0.0003, longitude: 0.00285 },
      { latitude: -0.00136, longitude: 0.00285 },
      { latitude: -0.00136, longitude: 0.00025 },
    ],
  },
  {
    id: "Escalera Indep2",
    tipo: "estructura",
    concurrencia: "Alta",
    nombre: "Escaleras\nEdificio: Independencia 2\nPiso: 5\nConecta pisos: 1-8\n",
    coordenadas: [
      { latitude: 0.01, longitude: 0.0006 },
      { latitude: 0.01, longitude: 0.004 },
      { latitude: 0.0085, longitude: 0.004 },
      { latitude: 0.0085, longitude: 0.0006 },
    ],
  },
  {
    id: "Ascensor Indep2",
    tipo: "ascensor",
    concurrencia: null,
    nombre: "Ascensor\nEdificio: Independencia 2\nPiso: 5\nConecta pisos: 1-8",
    routingId: "Ascensor Indep2",
    coordenadas: [
      { latitude: 0.01, longitude: -0.00015 },
      { latitude: 0.0089, longitude: -0.00015 },
      { latitude: 0.0089, longitude: 0.0006 },
      { latitude: 0.01, longitude: 0.0006 },
    ],
  },
  {
    id: "Ascensor Indep2-2",
    tipo: "ascensor",
    concurrencia: null,
    nombre: "Ascensor\nEdificio: Independencia 2\nPiso: 5\nConecta pisos: 1-8\n",
    routingId: "Ascensor Indep2",
    coordenadas: [
      { latitude: 0.01, longitude: -0.0008 },
      { latitude: 0.0089, longitude: -0.0008 },
      { latitude: 0.0089, longitude: -0.00016 },
      { latitude: 0.01, longitude: -0.00016 },
    ],
  },
  {
    id: "Ascensor Indep1",
    tipo: "ascensor",
    concurrencia: null,
    nombre: "Ascensor\nEdificio: Independencia 1\nPiso: 5\nConecta pisos: 1-8\n",
    routingId: "Ascensor Indep1",
    coordenadas: [
      { latitude: -0.0032, longitude: 0.001 },
      { latitude: -0.0032, longitude: 0.00193 },
      { latitude: -0.0042, longitude: 0.00193 },
      { latitude: -0.0042, longitude: 0.001 },
    ],
  },
  {
    id: "Ascensor Indep1-2",
    tipo: "ascensor",
    concurrencia: null,
    nombre: "Ascensor\nEdificio: Independencia 1\nPiso: 5\nConecta pisos: 1-8\n",
    routingId: "Ascensor Indep1",
    coordenadas: [
      { latitude: -0.0032, longitude: 0.00195 },
      { latitude: -0.0032, longitude: 0.0029 },
      { latitude: -0.0042, longitude: 0.0029 },
      { latitude: -0.0042, longitude: 0.00195 },
    ],
  },
  {
    id: "Baño de Hombres",
    tipo: "servicio",
    concurrencia: "Baja",
    nombre: "Baño Hombre\nEdificio: Independencia 2\nPiso: 5\nGénero: Masculino\nEstado: Operativo.\n",
    routingId: "Baño de Hombres",
    coordenadas: [
      { latitude: 0.01, longitude: -0.00273 },
      { latitude: 0.00846, longitude: -0.00273 },
      { latitude: 0.00846, longitude: -0.00146 },
      { latitude: 0.01, longitude: -0.00146 },
    ],
  },
  {
    id: "Baño de Mujeres",
    tipo: "servicio",
    concurrencia: "Media",
    nombre: "Baño Mujer\nEdificio: Independencia 2\nPiso: 5\nGénero: Femenino\nEstado: Operativo\n",
    routingId: "Baño de Mujeres",
    coordenadas: [
      { latitude: 0.01, longitude: -0.004 },
      { latitude: 0.00846, longitude: -0.004 },
      { latitude: 0.00846, longitude: -0.00275 },
      { latitude: 0.01, longitude: -0.00275 },
    ],
  },
  {
    id: "Kiosco",
    tipo: "comercio",
    concurrencia: "Media",
    nombre:
      "Kiosco\nNombre: Kiosco central\nTipo de local: Kiosco\nEstado: Activo\nHorario de atención: Lunes-Viernes (13hs-16hs)\n",
    routingId: "Kiosco",
    coordenadas: [
      { latitude: -0.0042, longitude: 0.00025 },
      { latitude: -0.0042, longitude: 0.00285 },
      { latitude: -0.00685, longitude: 0.00285 },
      { latitude: -0.00685, longitude: 0.00025 },
    ],
  },
  {
    id: "Expendedora",
    tipo: "servicio",
    concurrencia: "Media",
    nombre: "Maquinas expendedoras\nTipo: Cafe y bebidas\n",
    routingId: "Expendedora",
    coordenadas: [
      { latitude: -0.0069, longitude: 0.00025 },
      { latitude: -0.0069, longitude: 0.00155 },
      { latitude: -0.00735, longitude: 0.00155 },
      { latitude: -0.00735, longitude: 0.00025 },
    ],
  },
  {
    id: "Limpieza",
    tipo: "mantenimiento",
    concurrencia: "Baja",
    nombre:
      "Almacenamiento\nEdificio: Independencia 2\nPiso: 5\nNúmero: 10\nTipo de almacenamiento: Limpieza\nEstado: Activo\n",
    routingId: "Limpieza",
    coordenadas: [
      { latitude: 0.01, longitude: -0.00145 },
      { latitude: 0.00846, longitude: -0.00145 },
      { latitude: 0.00846, longitude: -0.0009 },
      { latitude: 0.01, longitude: -0.0009 },
    ],
  },
  {
    id: "Aula 547",
    tipo: "aula",
    concurrencia: "Baja",
    nombre:
      "Aula 547\nEdificio: Independencia 2\nPiso: 5\nNúmero: 101\nCapacidad: 50 personas\nTipo de aula: Teórica (Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Miercoles-Jueves (13:30pm-18pm)\nEstado: Disponible\n",
    routingId: "Aula 547",
    coordenadas: [
      { latitude: 0.0078, longitude: -0.00395 },
      { latitude: 0.00405, longitude: -0.00395 },
      { latitude: 0.00405, longitude: -0.0007 },
      { latitude: 0.0078, longitude: -0.0007 },
    ],
  },
  {
    id: "Aula 545",
    tipo: "aula",
    concurrencia: "Baja",
    nombre:
      "Aula 545\nEdificio: Independencia 2\nPiso: 5\nNúmero: 102\nCapacidad: 63 personas\nTipo de aula: Práctica (PCs, Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Lunes-Viernes (7am-20pm)\n",
    routingId: "Aula 545",
    coordenadas: [
      { latitude: 0.004, longitude: -0.0036 },
      { latitude: 0.00038, longitude: -0.0036 },
      { latitude: 0.00038, longitude: -0.00085 },
      { latitude: 0.004, longitude: -0.00085 },
    ],
  },
  {
    id: "Aula 544",
    tipo: "aula",
    concurrencia: "Baja",
    nombre:
      "Aula 544\nEdificio: Independencia 1\nPiso: 5\nNúmero: 103\nCapacidad: 50 personas\nTipo de aula: Teórica (Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Jueves-Viernes (13:30pm-20pm)\nEstado: Reservada\n",
    routingId: "Aula 544",
    coordenadas: [
      { latitude: 0.00033, longitude: -0.0036 },
      { latitude: -0.00365, longitude: -0.0036 },
      { latitude: -0.00365, longitude: -0.00085 },
      { latitude: 0.00033, longitude: -0.00085 },
    ],
  },
  {
    id: "Aula 543",
    tipo: "aula",
    concurrencia: "Alta",
    nombre:
      "Aula 543\nEdificio: Independencia 1\nPiso: 5\nNúmero: 104\nCapacidad: 50 personas\nTipo de aula: Teórica (Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Martes-Miercoles (15:00pm-16:30pm)\nEstado: Disponible\n",
    routingId: "Aula 543",
    coordenadas: [
      { latitude: -0.0037, longitude: -0.0036 },
      { latitude: -0.00685, longitude: -0.0036 },
      { latitude: -0.00685, longitude: -0.00085 },
      { latitude: -0.0037, longitude: -0.00085 },
    ],
  },
  {
    id: "Aula 542",
    tipo: "aula",
    concurrencia: "Media",
    nombre:
      "Aula 542\nEdificio: Independencia 1\nPiso: 5\nNúmero: 105\nCapacidad: 40 personas\nTipo de aula: Teórica (Lunes-Jueves(7am-22pm))\nEstado: Disponible\n",
    routingId: "Aula 542",
    coordenadas: [
      { latitude: -0.01, longitude: -0.0036 },
      { latitude: -0.01, longitude: 0.00027 },
      { latitude: -0.0085, longitude: 0.00027 },
      { latitude: -0.0085, longitude: -0.00085 },
      { latitude: -0.0069, longitude: -0.00085 },
      { latitude: -0.0069, longitude: -0.0036 },
    ],
  },
  {
    id: "Aula 548",
    tipo: "aula",
    concurrencia: "Alta",
    nombre:
      "Aula 548\nEdificio: Independencia 1\nPiso: 5\nNúmero: 106\nCapacidad: 50 personas\nTipo de aula: Teórica (Cámara y Micrófono)\nHorario de disponibilidad: Miercoles-Viernes (13:30pm-15pm)\n",
    routingId: "Aula 548",
    coordenadas: [
      { latitude: 0.00405, longitude: 0.00009 },
      { latitude: 0.00405, longitude: 0.004 },
      { latitude: 0.0078, longitude: 0.004 },
      { latitude: 0.0078, longitude: 0.0012 },
      { latitude: 0.00735, longitude: 0.0012 },
      { latitude: 0.00735, longitude: 0.00009 },
    ],
  },
  {
    id: "Aula 546",
    tipo: "aula",
    concurrencia: "Media",
    nombre:
      "Aula 546\nEdificio: Independencia 1\nPiso: 5\nNúmero: 107\nCapacidad: 60 personas\nTipo de aula: Teórica (Proyector, Parlantes, Cámara y Micrófono)\nHorario de disponibilidad: Lunes-Martes (7am-16pm)\nEstado: Reservada\n",
    routingId: "Aula 546",
    coordenadas: [
      { latitude: 0.004, longitude: 0.0003 },
      { latitude: 0.00038, longitude: 0.0003 },
      { latitude: 0.00038, longitude: 0.00285 },
      { latitude: 0.004, longitude: 0.00285 },
    ],
  },
]

const nodosDelCamino = [
  { id: "Baño de Mujeres", coordenada: { latitude: 0.0085, longitude: -0.0032 } },
  { id: "Baño de Hombres", coordenada: { latitude: 0.0085, longitude: -0.0023 } },
  { id: "Limpieza", coordenada: { latitude: 0.0085, longitude: -0.00121 } },
  { id: "Escalera Indep2", coordenada: { latitude: 0.00854, longitude: 0.0015 } },
  { id: "Ascensor Indep2", coordenada: { latitude: 0.008879117632134888, longitude: -0.0002801887011528015 } },
  { id: "Aula 547", coordenada: { latitude: 0.00467554385900846, longitude: -0.0006979721856117249 } },
  { id: "Aula 548", coordenada: { latitude: 0.00467554385900846, longitude: 0.00015 } },
  { id: "Aula 545", coordenada: { latitude: 0.0008522719144590833, longitude: -0.000848231291770935 } },
  { id: "Aula 546", coordenada: { latitude: 0.0008522719144590833, longitude: 0.00028 } },
  { id: "Ascensor Indep1", coordenada: { latitude: -0.00322, longitude: 0.00194 } },
  { id: "Escalera Indep1", coordenada: { latitude: -0.00137, longitude: 0.0013525038957595825 } },
  { id: "Kiosco", coordenada: { latitude: -0.00685, longitude: 0.0019144266843795774 } },
  { id: "Expendedora", coordenada: { latitude: -0.007302, longitude: 0.0007272139191627502 } },
  { id: "Aula 544", coordenada: { latitude: -0.003328956661731847, longitude: -0.0008488 } },
  { id: "Aula 543", coordenada: { latitude: -0.006778947993196767, longitude: -0.0008488 } },
  { id: "Aula 542", coordenada: { latitude: -0.007302, longitude: -0.0008488 } },
  { id: "nodoConexion18", coordenada: { latitude: -0.003328956661731847, longitude: -0.0002801887011528015 } },
  { id: "nodoConexion19", coordenada: { latitude: -0.0018755346533251007, longitude: -0.0002801887011528015 } },
  { id: "nodoConexion21", coordenada: { latitude: 0.0008522719144590833, longitude: -0.0002801887011528015 } },
  { id: "nodoConexion23", coordenada: { latitude: -0.007302, longitude: -0.0002801887011528015 } },
  { id: "nodoConexion25", coordenada: { latitude: 0.008134804638720128, longitude: -0.00121 } },
  { id: "nodoConexion26", coordenada: { latitude: 0.008134804638720128, longitude: -0.0023 } },
  { id: "nodoConexion27", coordenada: { latitude: 0.008134804638720128, longitude: -0.0032 } },
  { id: "nodoConexion29", coordenada: { latitude: 0.008134804638720128, longitude: 0.0015 } },
  { id: "nodoConexion30", coordenada: { latitude: -0.008138827952189035, longitude: -0.0002801887011528015 } },
  { id: "nodoConexion31", coordenada: { latitude: -0.008138827952189035, longitude: 0.00073 } },
  { id: "nodoConexion32", coordenada: { latitude: -0.008138827952189035, longitude: 0.00191 } },
  { id: "nodoConexion33", coordenada: { latitude: 0.00467554385900846, longitude: -0.0002801887011528015 } },
  { id: "nodoConexion34", coordenada: { latitude: 0.008134804638720128, longitude: -0.0002801887011528015 } },
  { id: "nodoConexion35", coordenada: { latitude: -0.0018755346533251007, longitude: 0.0013525038957595825 } },
  { id: "nodoConexion36", coordenada: { latitude: -0.0018755346533251007, longitude: 0.00194 } },
  { id: "nodoConexion37", coordenada: { latitude: -0.006778947993196767, longitude: -0.0002801887011528015 } },
]

const generarCoordenadasNodoPoligono = (centro, tamano) => {
  const medioTamano = tamano / 2
  return [
    { latitude: centro.latitude - medioTamano, longitude: centro.longitude - medioTamano },
    { latitude: centro.latitude + medioTamano, longitude: centro.longitude - medioTamano },
    { latitude: centro.latitude + medioTamano, longitude: centro.longitude + medioTamano },
    { latitude: centro.latitude - medioTamano, longitude: centro.longitude + medioTamano },
  ]
}

const formatSecondsToMinutesAndSeconds = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return "N/A"
  }
  const minutos = Math.floor(totalSeconds / 60)
  const segundos = Math.round(totalSeconds % 60)
  return `${minutos}m ${segundos}s`
}

const conexionesBase = {
  nodoConexion32: ["nodoConexion31", "Kiosco"],
  nodoConexion31: ["nodoConexion30", "Expendedora"],
  nodoConexion30: ["nodoConexion23"],
  nodoConexion23: ["Aula 542", "nodoConexion37"],
  nodoConexion18: ["Aula 544", "nodoConexion19"],
  nodoConexion19: ["nodoConexion35", "nodoConexion21"],
  nodoConexion35: ["Escalera Indep1", "nodoConexion36"],
  nodoConexion21: ["Aula 546", "Aula 545", "nodoConexion33"],
  nodoConexion33: ["Aula 548", "Aula 547", "nodoConexion34"],
  nodoConexion34: ["nodoConexion29", "Ascensor Indep2", "nodoConexion25"],
  nodoConexion25: ["Limpieza", "nodoConexion26"],
  nodoConexion26: ["Baño de Hombres", "nodoConexion27"],
  nodoConexion27: ["Baño de Mujeres"],
  nodoConexion29: ["Escalera Indep2"],
  nodoConexion36: ["Ascensor Indep1"],
  nodoConexion37: ["Aula 543", "nodoConexion18"],
  "Baño de Mujeres": [],
  "Baño de Hombres": [],
  Limpieza: [],
  "Escalera Indep2": [],
  "Ascensor Indep2": [],
  "Aula 547": [],
  "Aula 548": [],
  "Aula 545": [],
  "Aula 546": [],
  "Ascensor Indep1": [],
  "Escalera Indep1": [],
  Kiosco: [],
  Expendedora: [],
  "Aula 544": [],
  "Aula 543": [],
  "Aula 542": [],
}

const conexionesNodosPonderadas = {}
const generarPesoAleatorio = () => Number.parseFloat((Math.random() * 4 + 1).toFixed(1))

for (const nodoId in conexionesBase) {
  if (!conexionesNodosPonderadas[nodoId]) conexionesNodosPonderadas[nodoId] = []
  if (nodosDelCamino.find((n) => n.id === nodoId)) {
    conexionesBase[nodoId].forEach((vecinoId) => {
      if (nodosDelCamino.find((n) => n.id === vecinoId)) {
        conexionesNodosPonderadas[nodoId].push({ idVecino: vecinoId, peso: generarPesoAleatorio() })
      }
    })
  }
}

Object.keys(conexionesNodosPonderadas).forEach((nodoId) => {
  if (conexionesNodosPonderadas[nodoId]) {
    conexionesNodosPonderadas[nodoId].forEach((conexion) => {
      const { idVecino, peso } = conexion
      if (nodosDelCamino.find((n) => n.id === idVecino)) {
        if (!conexionesNodosPonderadas[idVecino]) conexionesNodosPonderadas[idVecino] = []
        if (!conexionesNodosPonderadas[idVecino].find((c) => c.idVecino === nodoId)) {
          conexionesNodosPonderadas[idVecino].push({ idVecino: nodoId, peso: peso })
        }
      }
    })
  }
})

const encontrarCaminoDijkstra = (inicioId, finId, grafo, todosLosNodos) => {
  const distancias = {}
  const previos = {}
  const cola = []
  const nodosMap = new Map(todosLosNodos.map((n) => [n.id, n]))
  for (const nodo of todosLosNodos) {
    distancias[nodo.id] = Number.POSITIVE_INFINITY
    previos[nodo.id] = null
  }
  if (!nodosMap.has(inicioId) || !nodosMap.has(finId)) {
    return { camino: [], pesoTotal: null }
  }
  distancias[inicioId] = 0
  cola.push({ id: inicioId, pesoTotal: 0 })
  while (cola.length > 0) {
    cola.sort((a, b) => a.pesoTotal - b.pesoTotal)
    const { id: actualId, pesoTotal: pesoActual } = cola.shift()
    if (actualId === finId && distancias[actualId] !== Number.POSITIVE_INFINITY) break
    if (pesoActual > distancias[actualId]) continue
    const vecinos = grafo[actualId] || []
    for (const conexionVecino of vecinos) {
      const { idVecino, peso: pesoArista } = conexionVecino
      if (!nodosMap.has(idVecino)) {
        continue
      }
      const nuevoPesoAcumulado = distancias[actualId] + pesoArista
      if (nuevoPesoAcumulado < distancias[idVecino]) {
        distancias[idVecino] = nuevoPesoAcumulado
        previos[idVecino] = actualId
        cola.push({ id: idVecino, pesoTotal: nuevoPesoAcumulado })
      }
    }
  }
  const caminoCoords = []
  let tempFinId = finId
  if (distancias[tempFinId] === Number.POSITIVE_INFINITY) {
    return { camino: [], pesoTotal: null }
  }
  while (tempFinId) {
    const nodoActual = nodosMap.get(tempFinId)
    if (nodoActual) caminoCoords.unshift(nodoActual.coordenada)
    else return { camino: [], pesoTotal: null }
    if (tempFinId === inicioId) break
    tempFinId = previos[tempFinId]
    if (!tempFinId && caminoCoords.length > 0 && caminoCoords[0] !== nodosMap.get(inicioId)?.coordenada) {
      return { camino: [], pesoTotal: null }
    }
  }
  return { camino: caminoCoords, pesoTotal: distancias[finId] }
}

// --- COMPONENTES AUXILIARES MEJORADOS ---
const ConcurrencyMeter = ({ level }) => {
  const levelLower = level ? level.toLowerCase() : ""
  const bars = [1, 2, 3]

  const getColor = (barIndex) => {
    if (levelLower === "baja" && barIndex === 0) return "#10B981"
    if (levelLower === "media" && barIndex < 2) return "#F59E0B"
    if (levelLower === "alta" && barIndex < 3) return "#EF4444"
    return "#E5E7EB"
  }

  return (
    <View style={styles.meterContainer}>
      {bars.map((_, index) => (
        <View key={index} style={[styles.meterBar, { backgroundColor: getColor(index) }]} />
      ))}
      <Text style={styles.meterText}>{level}</Text>
    </View>
  )
}

const SalaDetailCard = ({ sala, onClose, onNavigateToHere }) => {
  const { deviceCount, isConcurrencyModeActive } = useBLEContext()
  const detailsRaw = sala.nombre.split("\n").filter(Boolean)
  const title = detailsRaw.shift() || "Detalles"

  const parsedDetails = detailsRaw
    .map((line) => {
      const parts = line.split(":")
      return { key: parts[0]?.trim(), value: parts[1]?.trim() }
    })
    .filter((detail) => detail.key && detail.value)

  let finalConcurrency = sala.concurrencia
  if (sala.tipo === "ascensor" && !sala.nombre.includes("En mantenimiento")) {
    if (deviceCount === 0) finalConcurrency = "Baja"
    else if (deviceCount === 1) finalConcurrency = "Media"
    else finalConcurrency = "Alta"
  }

  if (finalConcurrency) {
    const existingIndex = parsedDetails.findIndex((d) => d.key.toLowerCase() === "concurrencia")
    if (existingIndex !== -1) {
      parsedDetails[existingIndex].value = finalConcurrency
    } else {
      parsedDetails.push({ key: "Concurrencia", value: finalConcurrency })
    }
  }

  const getIconForDetail = (key) => {
    switch (key.toLowerCase()) {
      case "concurrencia":
        return "account-multiple"
      case "edificio":
        return "domain"
      case "piso":
        return "layers-outline"
      case "número":
        return "pound"
      case "capacidad":
        return "account-group-outline"
      case "tipo de aula":
        return "cast-education"
      case "estado":
        return "information-outline"
      case "horario de disponibilidad":
        return "clock-outline"
      case "género":
        return "gender-male-female"
      case "conecta pisos":
        return "stairs"
      case "tipo":
        return "tag-outline"
      case "nombre":
        return "pencil-outline"
      case "tipo de local":
        return "store-outline"
      case "horario de atención":
        return "calendar-clock"
      default:
        return "chevron-right"
    }
  }

  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : ""
    if (s.includes("disponible") || s.includes("activo") || s.includes("operativo")) return styles.statusAvailable
    if (s.includes("reservada")) return styles.statusWarning
    if (s.includes("en mantenimiento") || s.includes("cerrado")) return styles.statusError
    return {}
  }

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close-circle" size={24} color="#9CA3AF" />
      </TouchableOpacity>

      <View style={styles.grabber} />

      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {nodosDelCamino.some((n) => n.id === (sala.routingId || sala.id)) && (
        <TouchableOpacity style={styles.navigateButton} onPress={() => onNavigateToHere(sala.routingId || sala.id)}>
            <MaterialIcons name="navigation" size={16} color="white" />
            <Text style={styles.navigateButtonText}>Ir aquí</Text>
        </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.detailsList} showsVerticalScrollIndicator={false}>
        {parsedDetails.map((detail, index) => (
          <View key={index} style={styles.detailRow}>
            <MaterialCommunityIcons name={getIconForDetail(detail.key)} size={16} color="#6B7280" style={styles.icon} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailKey}>{detail.key}</Text>
              {detail.key.toLowerCase() === "concurrencia" ? (
                <ConcurrencyMeter level={detail.value} />
              ) : (
                <Text style={[styles.detailValue, getStatusStyle(detail.value)]}>{detail.value}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

// --- COMPONENTE PRINCIPAL ---
const IndoorMapScreen = ({ onGoBack }) => {
  const { deviceCount, isConcurrencyModeActive, toggleConcurrencyMode, routeDestination, clearRouteDestination  } = useBLEContext()
  const [optionsModalVisible, setOptionsModalVisible] = useState(false)
  const [selectedSala, setSelectedSala] = useState(null)
  const [rutaCalculadaCoordenadas, setRutaCalculadaCoordenadas] = useState([])
  const [pesoTotalRuta, setPesoTotalRuta] = useState(null)
  const [tiempoEstimadoFormateado, setTiempoEstimadoFormateado] = useState(null)
  const [selectedNodoInicioId, setSelectedNodoInicioId] = useState(null)
  const [selectedNodoFinId, setSelectedNodoFinId] = useState(null)
  const [locationModalVisible, setLocationModalVisible] = useState(false)
  const [editingSelector, setEditingSelector] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState(null)
  const mapRef = useRef(null)

  useEffect(() => {
    // Si hay un destino guardado en el contexto...
    if (routeDestination) {
      console.log(`[Contexto] Destino recibido: "${routeDestination}"`);
      
      // Valida si el destino existe en tu mapa
      const esNodoValido = nodosImportantes.some(nodo => nodo.id === routeDestination);
      
      if (esNodoValido) {
        // ...fíjalo en el selector "HASTA"
        setSelectedNodoFinId(routeDestination);
        setSelectedNodoInicioId(null); // Limpia el origen
        setFeedbackMessage(`Destino fijado: "${routeDestination}". Ahora selecciona tu origen.`);

        // IMPORTANTE: Limpia el destino del contexto para que no se vuelva
        // a usar la próxima vez que entres a esta pantalla.
        clearRouteDestination();
      } else {
        console.error("El destino del contexto no es un nodo válido en este mapa.");
        clearRouteDestination(); // Límpialo aunque sea inválido
      }
    }
  }, [routeDestination]);

  const nodosImportantes = useMemo(
    () =>
      nodosDelCamino
        .filter((nodo) => !nodo.id.toLowerCase().includes("nodoconexion"))
        .sort((a, b) => a.id.localeCompare(b.id)),
    [],
  )

  const filteredNodos = useMemo(
    () => nodosImportantes.filter((nodo) => nodo.id.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm, nodosImportantes],
  )

  const getSalaColor = (sala) => {
    const modoActual = isConcurrencyModeActive ? "modoConcurrencia" : "modoNormal"
    const paletaNormal = colorModes.get("modoNormal")
    const paletaConcurrencia = colorModes.get("modoConcurrencia")

    if (sala.nombre.includes("En mantenimiento") || sala.nombre.includes("Cerrado")) {
      return paletaNormal.mantenimiento
    }

    if (sala.tipo === "ascensor") {
      if (deviceCount === 0) return paletaConcurrencia.Baja
      if (deviceCount === 1) return paletaConcurrencia.Media
      return paletaConcurrencia.Alta
    }

    if (modoActual === "modoConcurrencia") {
      return paletaConcurrencia[sala.concurrencia] || paletaConcurrencia.Default
    } else {
      return paletaNormal[sala.tipo] || paletaNormal.servicio
    }
  }

  useEffect(() => {
    if (selectedNodoInicioId && selectedNodoFinId) {
      try {
        const resultadoRuta = encontrarCaminoDijkstra(
          selectedNodoInicioId,
          selectedNodoFinId,
          conexionesNodosPonderadas,
          nodosDelCamino,
        )
        setRutaCalculadaCoordenadas(resultadoRuta.camino)
        setPesoTotalRuta(resultadoRuta.pesoTotal)

        if (resultadoRuta.pesoTotal !== null && resultadoRuta.camino.length > 0) {
          const tiempoEnSegundos = resultadoRuta.pesoTotal * SEGUNDOS_POR_UNIDAD_DE_PESO
          setTiempoEstimadoFormateado(formatSecondsToMinutesAndSeconds(tiempoEnSegundos))
        } else {
          setTiempoEstimadoFormateado(null)
        }

        if (resultadoRuta.camino.length === 0 && selectedNodoInicioId !== selectedNodoFinId) {
          Alert.alert("Ruta no encontrada", "No se pudo encontrar un camino entre los nodos seleccionados.")
        }
      } catch (error) {
        console.error("Error al calcular la ruta Dijkstra:", error)
        Alert.alert("Error", "Ocurrió un error al calcular la ruta.")
        setRutaCalculadaCoordenadas([])
        setPesoTotalRuta(null)
        setTiempoEstimadoFormateado(null)
      }
    } else {
      setRutaCalculadaCoordenadas([])
      setPesoTotalRuta(null)
      setTiempoEstimadoFormateado(null)
    }
  }, [selectedNodoInicioId, selectedNodoFinId])

  const handleMapPress = () => setSelectedSala(null)
  const handleSalaPress = (sala) => setSelectedSala(sala)
  const handleCloseDetailCard = () => setSelectedSala(null)

  const handleOpenLocationModal = (selector) => {
    setEditingSelector(selector)
    setLocationModalVisible(true)
    setSearchTerm("")
  }

  const handleSelectLocation = (nodoId) => {
    if (editingSelector === "start") {
      if (nodoId === selectedNodoFinId) {
        Alert.alert("Aviso", "El origen no puede ser igual al destino.")
        return
      }
      setSelectedNodoInicioId(nodoId)
    } else {
      if (nodoId === selectedNodoInicioId) {
        Alert.alert("Aviso", "El destino no puede ser igual al origen.")
        return
      }
      setSelectedNodoFinId(nodoId)
    }
    setSearchTerm("")
    setLocationModalVisible(false)
  }

  const handleNavigateFromDetail = (nodeIdForRouting) => {
    setSelectedSala(null)
    setSelectedNodoFinId(nodeIdForRouting)
    setSelectedNodoInicioId(null)
    setFeedbackMessage(`Destino: "${nodeIdForRouting}". Selecciona tu origen.`)
    setTimeout(() => setFeedbackMessage(null), 4000)
  }

  const clearRoute = () => {
    setSelectedNodoInicioId(null)
    setSelectedNodoFinId(null)
    setRutaCalculadaCoordenadas([])
    setPesoTotalRuta(null)
    setTiempoEstimadoFormateado(null)
    setFeedbackMessage(null)
  }

  return (
    <View style={styles.container}>
      {/* Modal de selección de ubicación */}
      <Modal animationType="slide" visible={locationModalVisible} onRequestClose={() => setLocationModalVisible(false)}>
        <View style={styles.locationModalContainer}>
          <View style={styles.locationModalHeader}>
            <Text style={styles.locationModalTitle}>
              {editingSelector === "start" ? "Selecciona Origen" : "Selecciona Destino"}
            </Text>
            <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar ubicación..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <FlatList
            data={filteredNodos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.locationItem} onPress={() => handleSelectLocation(item.id)}>
                <Text style={styles.locationItemText}>{item.id}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Panel de navegación mejorado */}
      <View style={styles.routeContainer}>
        <View style={styles.routeSelectors}>
          <TouchableOpacity style={styles.customSelector} onPress={() => handleOpenLocationModal("start")}>
            <View style={styles.selectorContent}>
              <Text style={styles.customSelectorLabel}>DESDE</Text>
              <Text style={styles.customSelectorText} numberOfLines={1}>
                {selectedNodoInicioId || "Seleccionar origen"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.customSelector} onPress={() => handleOpenLocationModal("end")}>
            <View style={styles.selectorContent}>
              <Text style={styles.customSelectorLabel}>HASTA</Text>
              <Text style={styles.customSelectorText} numberOfLines={1}>
                {selectedNodoFinId || "Seleccionar destino"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {feedbackMessage && (
          <View style={styles.feedbackContainer}>
            <Ionicons name="information-circle-outline" size={16} color="#3B82F6" />
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>
          </View>
        )}

        {selectedNodoInicioId && selectedNodoFinId && (
          <View style={styles.rutaInfoCard}>
            {rutaCalculadaCoordenadas.length > 0 && pesoTotalRuta !== null ? (
              <>
                <View style={styles.rutaInfoGrid}>
                  <View style={styles.rutaInfoColumn}>
                    <MaterialCommunityIcons name="walk" size={20} color="#3B82F6" />
                    <View style={styles.rutaInfoTextContainer}>
                      <Text style={styles.rutaInfoValor}>{pesoTotalRuta.toFixed(1)}m</Text>
                      <Text style={styles.rutaInfoLabel}>Distancia</Text>
                    </View>
                    </View>
                  <View style={styles.divider} />
                  <View style={styles.rutaInfoColumn}>
                    <MaterialCommunityIcons name="clock-time-four-outline" size={20} color="#3B82F6" />
                    <View style={styles.rutaInfoTextContainer}>
                      <Text style={styles.rutaInfoValor}>{tiempoEstimadoFormateado}</Text>
                      <Text style={styles.rutaInfoLabel}>Tiempo</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.clearRouteButton} onPress={clearRoute}>
                  <MaterialCommunityIcons name="close-circle-outline" size={16} color="white" />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.noRutaText}>No se pudo calcular la ruta.</Text>
            )}
          </View>
        )}
      </View>

      {/* Mapa */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialMapRegion}
        customMapStyle={customMapStyle}
        onPress={handleMapPress}
        minZoomLevel={14.5}
        maxZoomLevel={16}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsTraffic={false}
        showsUserLocation={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {planoInteriorImageSource && <Overlay image={planoInteriorImageSource} bounds={planoBounds} opacity={1} />}

        {salasIniciales.map((sala) => (
          <Polygon
            key={sala.id}
            coordinates={sala.coordenadas}
            fillColor={selectedSala?.id === sala.id ? "rgba(29, 78, 216, 0.7)" : getSalaColor(sala)}
            strokeColor="rgba(0,0,0,0.7)"
            strokeWidth={1.5}
            tappable
            onPress={() => handleSalaPress(sala)}
            zIndex={1}
          />
        ))}

        {nodosDelCamino.map((nodo) => {
          let fillColor = "rgba(100, 100, 255, 0)"
          if (selectedNodoInicioId === nodo.id) fillColor = "rgba(0,255,0,0.9)"
          else if (selectedNodoFinId === nodo.id) fillColor = "rgba(255,165,0,0.9)"
          return (
            <Polygon
              key={`nodo-poly-${nodo.id}`}
              coordinates={generarCoordenadasNodoPoligono(nodo.coordenada, TAMANO_NODO_POLIGONO)}
              fillColor={fillColor}
              strokeColor="rgba(0,0,100,0.8)"
              strokeWidth={0.1 * TAMANO_NODO_POLIGONO}
              zIndex={2}
            />
          )
        })}

        {rutaCalculadaCoordenadas.length > 1 && (
          <Polyline
            coordinates={rutaCalculadaCoordenadas}
            strokeColor="#3498DB"
            strokeWidth={5}
            lineCap="round"
            zIndex={3}
          />
        )}
      </MapView>

      {/* Botón de regreso */}
      {onGoBack && (
        <TouchableOpacity onPress={onGoBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
      )}

      {/* Botón Concurrencia */}
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

      {/* Navegador de pisos */}
      {/* <View style={styles.floorNavigatorContainer}>
        <TouchableOpacity
          style={styles.floorButton}
          onPress={() => Alert.alert("Próximamente", "Función para cambiar de piso no implementada.")}
        >
          <Ionicons name="caret-up" size={14} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.floorText}>Piso 5</Text>
        <TouchableOpacity
          style={styles.floorButton}
          onPress={() => Alert.alert("Próximamente", "Función para cambiar de piso no implementada.")}
        >
          <Ionicons name="caret-down" size={14} color="#1F2937" />
        </TouchableOpacity>
      </View> */}

      {/* Modal de detalles de sala */}
      {selectedSala && (
        <SalaDetailCard
          sala={selectedSala}
          onClose={handleCloseDetailCard}
          onNavigateToHere={handleNavigateFromDetail}
        />
      )}

      {/* Modal de funciones futuras */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLocationModal}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.futureModalOverlay}>
          <View style={styles.futureModalContent}>
            <View style={styles.futureModalIcon}>
              <FontAwesome5 name="map-marker-alt" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.futureModalTitle}>Próximamente</Text>
            <Text style={styles.futureModalText}>Esta función estará disponible en futuras actualizaciones</Text>
            <TouchableOpacity onPress={() => setShowLocationModal(false)} style={styles.futureModalButton}>
              <Text style={styles.futureModalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

// --- ESTILOS MEJORADOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },

  // Panel de navegación más compacto
  routeContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 15,
    left: 12,
    right: 12,
    zIndex: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  routeSelectors: {
    gap: 8,
  },

  customSelector: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  selectorContent: {
    flex: 1,
  },

  customSelectorLabel: {
    color: "#64748B",
    fontSize: 7,
    fontWeight: "600",
    marginBottom: 2,
    letterSpacing: 0.5,
  },

  customSelectorText: {
    color: "#1E293B",
    fontSize: 10,
    fontWeight: "500",
  },

  // Información de ruta más compacta
  rutaInfoCard: {
    marginTop: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 10,
  },

  rutaInfoGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  rutaInfoColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  rutaInfoTextContainer: {
    flexDirection: "column",
    alignItems: "center",
  },

  rutaInfoLabel: {
    fontSize: 8,
    color: "#64748B",
    fontWeight: "500",
  },

  rutaInfoValor: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "600",
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: "#CBD5E1",
  },

  clearRouteButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    top: 6,
    right: 6,
  },

  clearRouteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  noRutaText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    paddingVertical: 8,
  },

  // Feedback más sutil
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  feedbackText: {
    marginLeft: 6,
    color: "#1D4ED8",
    fontSize: 12,
    flexShrink: 1,
    fontWeight: "500",
  },

  // Modal de ubicación
  locationModalContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingTop: Platform.OS === "ios" ? 44 : 20,
  },

  locationModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "white",
  },

  locationModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },

  searchInputContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    marginLeft: 8,
  },

  locationItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "white",
  },

  locationItemText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },

  // Card de detalles más compacta
  cardContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
    maxHeight: "60%",
    paddingBottom: 100,
  },

  grabber: {
    width: 36,
    height: 4,
    backgroundColor: "#CBD5E1",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },

  navigateButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 20,
  },

  navigateButtonText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },

  detailsList: {
    maxHeight: 100,
    paddingTop: 8,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  icon: {
    marginRight: 10,
    marginTop: 4,
  },

  detailTextContainer: {
    flex: 1,
  },

  detailKey: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  detailValue: {
    fontSize: 10,
    color: "#334155",
    fontWeight: "500",
  },

  // Medidor de concurrencia más pequeño
  meterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  meterBar: {
    width: 10,
    height: 12,
    borderRadius: 2,
  },

  meterText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
    marginLeft: 6,
  },

  statusAvailable: {
    color: "#10B981",
    fontWeight: "600",
  },

  statusWarning: {
    color: "#F59E0B",
    fontWeight: "600",
  },

  statusError: {
    color: "#EF4444",
    fontWeight: "600",
  },

  // Botones flotantes más pequeños
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    borderRadius: 26,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    zIndex: 10,
  },

  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 15,
  },

  // Modal de opciones
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#1E293B",
  },

  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  modalButtonText: {
    marginLeft: 12,
    fontSize: 10,
    fontWeight: "500",
    color: "#334155",
  },

  closeButton: {
    position: "absolute",
    top: 8,
    right: 12,
    zIndex: 1,
  },

  // Navegador de pisos más compacto
  floorNavigatorContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    alignItems: "center",
    paddingVertical: 4,
    minWidth: 44,
  },

  floorButton: {
    paddingHorizontal: 12,
    paddingVertical: 2,
  },

   floorText: { 
    fontSize: 8, 
    fontWeight: 'bold', 
    color: '#1F2937', 
    paddingVertical: 4, 
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: '#E5E7EB', 
    width: '100%', 
    textAlign: 'center', 
    },

  // Modal de funciones futuras
  futureModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  futureModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  futureModalIcon: {
    width: 56,
    height: 56,
    backgroundColor: "#DBEAFE",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  futureModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 8,
  },

  futureModalText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  futureModalButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
  },

  futureModalButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
    navButton: {
        position: 'absolute',
        bottom: 100,
        height: 32,
        paddingHorizontal: 12,
        borderRadius: 99,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 2,
    },
    navButtonText: {
        fontWeight: '600',
        fontSize: 10,
    },
})

export default IndoorMapScreen
