import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

const Route = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { roomNumber } = route.params || { roomNumber: '' }
  
  const [originText, setOriginText] = useState(roomNumber || '')
  const [destinationText, setDestinationText] = useState('')
  const [intermediateRoutes, setIntermediateRoutes] = useState([]) // Nuevo estado
  const [transportInput, setTransportInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('clima')
  const [loading, setLoading] = useState(false)
  
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
    }
  ]
  

  const navigateToMap = (selectedRoute) => {
    navigation.navigate('Map', {
      route: selectedRoute,
      origin: selectedRoute.origin,
      destination: selectedRoute.destination
    })
  }
  
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [activeFilter])
  
  useEffect(() => {
    if (roomNumber) {
      setOriginText(roomNumber)
    }
  }, [roomNumber])
  
  const swapLocations = () => {
    const tempText = originText
    setOriginText(destinationText)
    setDestinationText(tempText)
  }

  // Función para agregar un destino intermedio
  const addIntermediateRoute = () => {
    setIntermediateRoutes([...intermediateRoutes, '']);
  };

  // Función para actualizar el valor de un destino intermedio
  const updateIntermediateRoute = (index, value) => {
    const updated = [...intermediateRoutes];
    updated[index] = value;
    setIntermediateRoutes(updated);
  };

  // Función para eliminar un destino intermedio
  const removeIntermediateRoute = (index) => {
    setIntermediateRoutes(intermediateRoutes.filter((_, i) => i !== index));
  };



  return (
    <ScrollView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Botón + fuera del cuadro blanco */}
      <View className="flex-row absolute right-0 top-24 items-center mx-4 mt-4">
        <View className="flex-1" />
        <TouchableOpacity
          className="bg-blue-500 rounded-full p-3 shadow-md"
          onPress={addIntermediateRoute}
          style={{ position: 'absolute', right: 0, zIndex: 10 }}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>


      {/* Location inputs */}
      <View className="ml-4 mt-4 mr-20 relative bg-white rounded-2xl shadow-md p-4 border border-gray-100">

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
          <TouchableOpacity className="mr-10 p-2" onPress={() => navigation.navigate('Camera')}>
            <MaterialIcons name="camera-alt" size={30} color="#D7D7D7" />
          </TouchableOpacity>
        </View>

        {/* Inputs para rutas intermedias */}
        {intermediateRoutes.map((value, idx) => (
          <View key={idx} className="flex-row border-b border-gray-100 pb-4 items-center mt-4">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Intermedio {idx + 1}</Text>
              <View className="flex-row items-center">
                <TextInput
                  value={value}
                  onChangeText={text => updateIntermediateRoute(idx, text)}
                  placeholder="Aula"
                  className="flex-1 text-gray-800 text-base"
                />
              </View>
            </View>
            <TouchableOpacity className="-mr-1 p-2" onPress={() => navigation.navigate('Camera')}>
              <MaterialIcons name="camera-alt" size={30} color="#D7D7D7" />
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2 p-2 rounded-full"
              onPress={() => removeIntermediateRoute(idx)}
            >
              <MaterialIcons name="close" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}

        <View className="flex-row items-center mt-4">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Destino</Text>
            <View className="flex-row items-center">
              <TextInput
                value={destinationText}
                onChangeText={setDestinationText}
                placeholder="Aula"
                className="flex-1 text-gray-800 text-base"
              />
            </View>
          </View>
          <TouchableOpacity className="mr-10 p-2" onPress={() => navigation.navigate('Camera')}>
            <MaterialIcons name="camera-alt" size={30} color="#D7D7D7" />
          </TouchableOpacity>
        </View>
        {/* Solo muestra el botón de swap si NO hay rutas intermedias */}
        {intermediateRoutes.length === 0 && (
          <TouchableOpacity 
            className="ml-2 p-2 absolute right-4 top-1/2 bg-gray-100 rounded-full"
            onPress={swapLocations}
          >
            <MaterialIcons name="swap-vert" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Considerations */}
      <View className="mx-4 mt-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Consideraciones</Text>
      </View>
      
      {/* Filters */}
      <View className="flex-row justify-around mx-4 mt-6">
        <TouchableOpacity 
          className={`items-center ${activeFilter === 'clima' ? 'opacity-100' : 'opacity-50'}`}
        >
          <View className={`w-12 h-12 rounded-full ${activeFilter === 'clima' ? 'bg-blue-500 shadow-md' : 'bg-gray-200'} items-center justify-center mb-1`}>
            <MaterialIcons name="cloud" size={24} color={activeFilter === 'clima' ? "#FFFFFF" : "#6B7280"} />
          </View>
          <Text className={`text-xs ${activeFilter === 'clima' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Clima</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`items-center ${activeFilter === 'accesibilidad' ? 'opacity-100' : 'opacity-50'}`}
        >
          <View className={`w-12 h-12 rounded-full ${activeFilter === 'accesibilidad' ? 'bg-blue-500 shadow-md' : 'bg-gray-200'} items-center justify-center mb-1`}>
            <MaterialIcons name="accessible" size={24} color={activeFilter === 'accesibilidad' ? "#FFFFFF" : "#6B7280"} />
          </View>
          <Text className={`text-xs ${activeFilter === 'accesibilidad' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Accesibilidad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
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
        ) : routes.length > 0 ? (
          routes.map((routeOption) => (
            <TouchableOpacity 
              key={routeOption.id} 
              className="bg-white rounded-2xl shadow-sm mb-4 p-4 border border-gray-100 active:bg-gray-50"
              onPress={() => navigateToMap(routeOption)}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 gap-2">
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
                  
                </View>
                
                {/* Time and distance */}
            <View className="flex flex-col items-end">
                <View className="items-end">
                  <Text className="text-2xl font-bold text-gray-800">{routeOption.time} <Text className="text-sm font-normal">min</Text></Text>
                  <Text className="text-sm text-gray-500">{routeOption.distance} mtrs</Text>
                </View>
              {/* Go button */}
                <View className="bg-blue-500 w-12 h-12 rounded-xl items-center justify-center shadow-sm">
                  <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
                </View>
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
    </ScrollView>
  )
}

export default Route