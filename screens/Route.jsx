import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

const Route = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { roomNumber } = route.params || { roomNumber: '' }
  
  const [originText, setOriginText] = useState(roomNumber || '')
  const [destinationText, setDestinationText] = useState('Lab 365')
  const [transportInput, setTransportInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('clima')
  const [loading, setLoading] = useState(false)
  
  // Rutas de ejemplo estáticas
  const routes = [
    {
      id: "route_1",
      time: 15,
      distance: 30,
      origin: { building: "LIMA 3", floor: "8° piso", name: "Aula 634" },
      destination: { building: "UADE LABS", floor: "3° piso", name: "Lab 365" },
      weatherProtected: true,
      accessibility: true,
      crowdLevel: "low",
      description: "Ruta más rápida por ascensor"
    },
    {
      id: "route_2",
      time: 23,
      distance: 37,
      origin: { building: "LIMA 3", floor: "8° piso", name: "Aula 634" },
      destination: { building: "UADE LABS", floor: "3° piso", name: "Lab 365" },
      weatherProtected: false,
      accessibility: false,
      crowdLevel: "medium",
      description: "Ruta por escaleras"
    },
    {
      id: "route_3",
      time: 25,
      distance: 39,
      origin: { building: "LIMA 3", floor: "8° piso", name: "Aula 634" },
      destination: { building: "UADE LABS", floor: "3° piso", name: "Lab 365" },
      weatherProtected: false,
      accessibility: true,
      crowdLevel: "high",
      description: "Ruta alternativa por patio central"
    }
  ]
  
  // Filtrar rutas según el filtro activo
  const getFilteredRoutes = () => {
    switch (activeFilter) {
      case 'clima':
        return [...routes].sort((a, b) => a.weatherProtected === b.weatherProtected ? 0 : a.weatherProtected ? -1 : 1)
      case 'accesibilidad':
        return routes.filter(r => r.accessibility).length > 0 
          ? routes.filter(r => r.accessibility) 
          : routes
      case 'concurrencia':
        return [...routes].sort((a, b) => {
          const crowdLevels = { low: 0, medium: 1, high: 2 }
          return crowdLevels[a.crowdLevel] - crowdLevels[b.crowdLevel]
        })
      default:
        return routes
    }
  }
  
  // Navegar al mapa con la ruta seleccionada
  const navigateToMap = (selectedRoute) => {
    navigation.navigate('Map', {
      route: selectedRoute,
      origin: selectedRoute.origin,
      destination: selectedRoute.destination
    })
  }
  
  // Simular búsqueda al cambiar filtros
  useEffect(() => {
    setLoading(true)
    // Simular delay de búsqueda
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [activeFilter])
  
  // Actualizar origen cuando se recibe el parámetro
  useEffect(() => {
    if (roomNumber) {
      setOriginText(roomNumber)
    }
  }, [roomNumber])
  
  // Función para intercambiar origen y destino
  const swapLocations = () => {
    const tempText = originText
    setOriginText(destinationText)
    setDestinationText(tempText)
  }

  // Obtener rutas filtradas
  const filteredRoutes = getFilteredRoutes()

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header with back button */}
      <View className="pt-12 px-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
      </View>
      
      {/* Location inputs */}
      <View className="mx-4 mt-4 bg-white rounded-2xl shadow-md p-4 border border-gray-100">
        <View className="flex-row items-center border-b border-gray-100 pb-4">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Origen</Text>
            <View className="flex-row items-center">
              <TextInput
                value={originText}
                onChangeText={setOriginText}
                placeholder="Aula"
                className="flex-1 text-gray-800 text-base"
              />
            </View>
          </View>
          <TouchableOpacity className="ml-2 p-2 bg-gray-100 rounded-full">
            <MaterialIcons name="my-location" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center mt-4">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Destino</Text>
            <View className="flex-row items-center">
              <TextInput
                value={destinationText}
                onChangeText={setDestinationText}
                placeholder="Laboratorio"
                className="flex-1 text-gray-800 text-base"
              />
            </View>
          </View>
          <TouchableOpacity className="ml-2 p-2 bg-gray-100 rounded-full">
            <MaterialIcons name="search" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="ml-2 p-2 bg-gray-100 rounded-full"
            onPress={swapLocations}
          >
            <MaterialIcons name="swap-vert" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Considerations */}
      <View className="mx-4 mt-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Consideraciones</Text>
        <View className="bg-white rounded-xl border border-gray-200 flex-row items-center px-4 py-3">
          <MaterialIcons name="directions-bus" size={20} color="#6B7280" style={{ marginRight: 8 }} />
          <TextInput
            value={transportInput}
            onChangeText={setTransportInput}
            placeholder="Ingresar transporte público"
            className="flex-1 text-gray-700"
          />
        </View>
      </View>
      
      {/* Filters */}
      <View className="flex-row justify-around mx-4 mt-6">
        <TouchableOpacity 
          onPress={() => setActiveFilter('clima')}
          className={`items-center ${activeFilter === 'clima' ? 'opacity-100' : 'opacity-50'}`}
        >
          <View className={`w-12 h-12 rounded-full ${activeFilter === 'clima' ? 'bg-blue-500 shadow-md' : 'bg-gray-200'} items-center justify-center mb-1`}>
            <MaterialIcons name="cloud" size={24} color={activeFilter === 'clima' ? "#FFFFFF" : "#6B7280"} />
          </View>
          <Text className={`text-xs ${activeFilter === 'clima' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Clima</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveFilter('accesibilidad')}
          className={`items-center ${activeFilter === 'accesibilidad' ? 'opacity-100' : 'opacity-50'}`}
        >
          <View className={`w-12 h-12 rounded-full ${activeFilter === 'accesibilidad' ? 'bg-blue-500 shadow-md' : 'bg-gray-200'} items-center justify-center mb-1`}>
            <MaterialIcons name="accessible" size={24} color={activeFilter === 'accesibilidad' ? "#FFFFFF" : "#6B7280"} />
          </View>
          <Text className={`text-xs ${activeFilter === 'accesibilidad' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Accesibilidad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setActiveFilter('concurrencia')}
          className={`items-center ${activeFilter === 'concurrencia' ? 'opacity-100' : 'opacity-50'}`}
        >
          <View className={`w-12 h-12 rounded-full ${activeFilter === 'concurrencia' ? 'bg-blue-500 shadow-md' : 'bg-gray-200'} items-center justify-center mb-1`}>
            <MaterialIcons name="groups" size={24} color={activeFilter === 'concurrencia' ? "#FFFFFF" : "#6B7280"} />
          </View>
          <Text className={`text-xs ${activeFilter === 'concurrencia' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Concurrencia</Text>
        </TouchableOpacity>
      </View>
      
      {/* Progress indicator */}
      <View className="mx-12 mt-2 h-1 bg-gray-200 rounded-full">
        <View className={`h-full bg-blue-500 rounded-full ${
          activeFilter === 'clima' ? 'w-1/3' : 
          activeFilter === 'accesibilidad' ? 'w-2/3' : 'w-full'
        }`} />
      </View>
      
      {/* Routes */}
      <ScrollView className="mt-6 px-4">
        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-4">Buscando rutas...</Text>
          </View>
        ) : filteredRoutes.length > 0 ? (
          filteredRoutes.map((routeOption) => (
            <TouchableOpacity 
              key={routeOption.id} 
              className="bg-white rounded-2xl shadow-sm mb-4 p-4 border border-gray-100 active:bg-gray-50"
              onPress={() => navigateToMap(routeOption)}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  {/* Origin */}
                  <View className="flex-row items-center mb-3">
                    <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <View className="w-3 h-3 rounded-full bg-blue-500" />
                    </View>
                    <Text className="text-gray-800 font-medium">
                      {`${routeOption.origin.building} | ${routeOption.origin.floor} ${routeOption.origin.name}`}
                    </Text>
                  </View>
                  
                  {/* Destination */}
                  <View className="flex-row items-center">
                    <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-3">
                      <View className="w-3 h-3 rounded-full bg-green-500" />
                    </View>
                    <Text className="text-gray-800 font-medium">
                      {`${routeOption.destination.building} | ${routeOption.destination.floor} ${routeOption.destination.name}`}
                    </Text>
                  </View>
                  
                  {/* Route features */}
                  <View className="flex-row mt-3 flex-wrap">
                    {routeOption.weatherProtected && (
                      <View className="bg-blue-50 rounded-full px-2 py-1 mr-2 mb-1 flex-row items-center">
                        <MaterialIcons name="umbrella" size={12} color="#3B82F6" style={{ marginRight: 2 }} />
                        <Text className="text-xs text-blue-600">Cubierto</Text>
                      </View>
                    )}
                    {routeOption.accessibility && (
                      <View className="bg-green-50 rounded-full px-2 py-1 mr-2 mb-1 flex-row items-center">
                        <MaterialIcons name="accessible" size={12} color="#10B981" style={{ marginRight: 2 }} />
                        <Text className="text-xs text-green-600">Accesible</Text>
                      </View>
                    )}
                    <View className={`rounded-full px-2 py-1 mr-2 mb-1 flex-row items-center
                      ${routeOption.crowdLevel === 'low' ? 'bg-green-50' : 
                        routeOption.crowdLevel === 'medium' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                      <MaterialIcons 
                        name="people" 
                        size={12} 
                        color={routeOption.crowdLevel === 'low' ? '#10B981' : 
                          routeOption.crowdLevel === 'medium' ? '#F59E0B' : '#EF4444'} 
                        style={{ marginRight: 2 }} 
                      />
                      <Text className={`text-xs 
                        ${routeOption.crowdLevel === 'low' ? 'text-green-600' : 
                          routeOption.crowdLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {routeOption.crowdLevel === 'low' ? 'Poco concurrido' : 
                          routeOption.crowdLevel === 'medium' ? 'Concurrencia media' : 'Muy concurrido'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Time and distance */}
                <View className="items-end">
                  <Text className="text-2xl font-bold text-gray-800">{routeOption.time} <Text className="text-sm font-normal">min</Text></Text>
                  <Text className="text-sm text-gray-500">{routeOption.distance} mtrs</Text>
                </View>
              </View>
              
              {/* Description */}
              <Text className="text-gray-500 text-sm mt-2">{routeOption.description}</Text>
              
              {/* Go button */}
              <View className="items-end mt-2">
                <View className="bg-blue-500 w-12 h-12 rounded-xl items-center justify-center shadow-sm">
                  <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center justify-center py-10">
            <MaterialIcons name="search-off" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4 text-center">No se encontraron rutas entre estas ubicaciones</Text>
            <Text className="text-gray-400 text-sm text-center mt-2">Intenta con otras ubicaciones o verifica los nombres</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default Route