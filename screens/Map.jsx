"use client"

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

const Map = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { route: selectedRoute, origin, destination } = route.params || {}
  
  const [currentFloor, setCurrentFloor] = useState(1)
  const [activeTab, setActiveTab] = useState('clases')
  
  const changeFloor = (direction) => {
    if (direction === 'up' && currentFloor < 8) {
      setCurrentFloor(currentFloor + 1)
    } else if (direction === 'down' && currentFloor > 1) {
      setCurrentFloor(currentFloor - 1)
    }
  }

  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Map Placeholder */}
      <View className="flex-1 mx-6 my-6">
        <View className="flex-1 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg border border-gray-200 items-center justify-center">
          <View className="backdrop-blur-sm rounded-xl px-6 py-4">
            <MaterialIcons name="place" size={32} color="#4B5563" style={{ alignSelf: 'center', marginBottom: 8 }} />
            <Text className="text-gray-600 font-medium text-center">Mapa</Text>
          </View>
        </View>
      </View>
      
      {/* Route Info and Actions */}
      <View className="bg-white rounded-t-3xl shadow-lg pt-4 pb-8">
        
        <View className="flex-row justify-between items-center px-4 mb-4">
          {/* Notas a la izquierda */}
          <TouchableOpacity className="bg-green-50 rounded-lg px-4 py-2 flex-row items-center">
            <MaterialIcons name="edit" size={18} color="#10B981" style={{ marginRight: 6 }} />
            <Text className="text-green-600 font-medium">Notas</Text>
          </TouchableOpacity>

          {/* Piso en el centro */}
          <View className="items-center">
            <View className="bg-white rounded-full flex-row items-center px-2 py-1">
              <TouchableOpacity 
                onPress={() => changeFloor('up')}
                className="w-8 h-8 items-center justify-center"
                disabled={currentFloor >= 8}
              >
                <MaterialIcons 
                  name="keyboard-arrow-up" 
                  size={24} 
                  color={currentFloor >= 8 ? "#D1D5DB" : "#111827"} 
                />
              </TouchableOpacity>
              
              <View className="px-4 py-1">
                <Text className="font-medium">Piso {currentFloor}</Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => changeFloor('down')}
                className="w-8 h-8 items-center justify-center"
                disabled={currentFloor <= 1}
              >
                <MaterialIcons 
                  name="keyboard-arrow-down" 
                  size={24} 
                  color={currentFloor <= 1 ? "#D1D5DB" : "#111827"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Vista en vivo a la derecha (igual estilo que Notas) */}
          <TouchableOpacity className="bg-blue-50 rounded-lg px-4 py-2 flex-row items-center">
            <MaterialIcons name="videocam" size={20} color="#2563eb" style={{ marginRight: 8 }} />
            <Text className="text-blue-600 font-medium">Vista en vivo</Text>
          </TouchableOpacity>
        </View>
        
        {/* Route Card */}
        <View className="mx-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <View className="p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center mb-3">
                  <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <View className="w-3 h-3 rounded-full bg-blue-500" />
                  </View>
                  <Text className="text-gray-800 font-medium">
                    {origin ? `${origin.building} | ${origin.floor} ${origin.room}` : 'LIMA 3 | 6° piso Aula 634'}
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-3">
                    <View className="w-3 h-3 rounded-full bg-green-500" />
                  </View>
                  <Text className="text-gray-800 font-medium">
                    {destination ? `${destination.building} | ${destination.floor} ${destination.room}` : 'UADE LABS | 3° piso Lab 365'}
                  </Text>
                </View>
              </View>
              
              <View className="items-end">
                <Text className="text-2xl font-bold text-gray-800">
                  {selectedRoute?.time || 15} <Text className="text-sm font-normal">min</Text>
                </Text>
                <Text className="text-sm text-gray-500">{selectedRoute?.distance || 30} mtrs</Text>
              </View>
            </View>
          </View>
          

        </View>
        
        <View className="flex-row justify-around mt-4 px-4">
          <TouchableOpacity 
            onPress={() => setActiveTab('clases')}
            className="items-center"
          >
            <View className={`w-12 h-12 rounded-lg items-center justify-center ${activeTab === 'clases' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <MaterialIcons 
                name="event-note" 
                size={24} 
                color={activeTab === 'clases' ? '#3B82F6' : '#6B7280'} 
              />
            </View>
            <Text className={`text-xs mt-1 ${activeTab === 'clases' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              Clases/Reuniones
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab('mapa3d')}
            className="items-center"
          >
            <View className={`w-12 h-12 rounded-lg items-center justify-center ${activeTab === 'mapa3d' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <MaterialIcons 
                name="3d-rotation" 
                size={24} 
                color={activeTab === 'mapa3d' ? '#3B82F6' : '#6B7280'} 
              />
            </View>
            <Text className={`text-xs mt-1 ${activeTab === 'mapa3d' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              Mapa 3D
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab('concurrencia')}
            className="items-center"
          >
            <View className={`w-12 h-12 rounded-lg items-center justify-center ${activeTab === 'concurrencia' ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <MaterialIcons 
                name="groups" 
                size={24} 
                color={activeTab === 'concurrencia' ? '#3B82F6' : '#6B7280'} 
              />
            </View>
            <Text className={`text-xs mt-1 ${activeTab === 'concurrencia' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
              Concurrencia
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Map