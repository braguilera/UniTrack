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
      
      {/* Header with back button */}
      <View className="pt-12 px-4 pb-2 bg-white flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 relative">
        <View className="flex-1 bg-gray-200">
          <View className="absolute top-0 left-0 right-0 bottom-0">
            <View className="absolute top-0 left-0 w-[25%] h-[20%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">UADE LABS</Text>
            </View>
            
            <View className="absolute top-[20%] left-0 w-[25%] h-[20%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">RESIDENCIA ESCUELA</Text>
            </View>
            
            <View className="absolute top-[40%] left-0 w-[25%] h-[20%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">INDEPENDENCIA 2</Text>
            </View>
            
            <View className="absolute top-[60%] left-0 w-[25%] h-[20%] bg-blue-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">INDEPENDENCIA 1</Text>
            </View>
            
            <View className="absolute top-[60%] left-[25%] w-[25%] h-[40%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">LIMA 3</Text>
            </View>
            
            <View className="absolute top-[60%] left-[50%] w-[25%] h-[40%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">LIMA 2</Text>
            </View>
            
            <View className="absolute top-[60%] left-[75%] w-[25%] h-[20%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">LIMA 1</Text>
            </View>
            
            <View className="absolute top-[80%] left-[75%] w-[25%] h-[20%] bg-red-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">CHILE 3</Text>
            </View>
            
            <View className="absolute top-0 left-[25%] w-[25%] h-[20%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">SALTA 2</Text>
            </View>
            
            <View className="absolute top-0 left-[50%] w-[50%] h-[20%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">CHILE 1</Text>
            </View>
            
            <View className="absolute top-[20%] left-[50%] w-[50%] h-[20%] bg-gray-500 border border-gray-400">
              <Text className="text-white text-xs font-bold p-2 text-center">CHILE 2</Text>
            </View>
            
            <View className="absolute top-[20%] left-[25%] w-[25%] h-[40%] bg-green-200 border border-gray-400">
              <View className="absolute top-[20%] left-[30%] w-3 h-3 rounded-full bg-green-600" />
              <View className="absolute top-[25%] left-[40%] w-3 h-3 rounded-full bg-green-600" />
              <View className="absolute top-[30%] left-[35%] w-3 h-3 rounded-full bg-green-600" />
              <View className="absolute top-[50%] left-[20%] w-3 h-3 rounded-full bg-green-600" />
              <View className="absolute top-[60%] left-[30%] w-3 h-3 rounded-full bg-green-600" />
              <View className="absolute top-[70%] left-[40%] w-3 h-3 rounded-full bg-green-600" />
              <View className="absolute top-[80%] left-[10%] w-3 h-3 rounded-full bg-green-600" />
            </View>
            
            <View className="absolute top-[75%] left-[85%] w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            
            <View className="absolute top-[75%] left-[60%] w-[25%] h-[0.5]" style={{ borderWidth: 2, borderColor: 'black', borderStyle: 'dashed' }} />
          </View>
        </View>
        
        {/* Floor Controls */}
        <View className="absolute bottom-32 left-0 right-0 items-center">
          <View className="bg-white rounded-full shadow-lg flex-row items-center px-2 py-1">
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
      </View>
      
      {/* Route Info and Actions */}
      <View className="bg-white rounded-t-3xl shadow-lg pt-4 pb-8">
        <View className="items-center mb-2">
          <View className="w-12 h-1 bg-gray-300 rounded-full" />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-4">
          <TouchableOpacity className="bg-blue-50 rounded-lg px-4 py-2 mr-3 flex-row items-center">
            <MaterialIcons name="share" size={18} color="#3B82F6" style={{ marginRight: 6 }} />
            <Text className="text-blue-600 font-medium">Compartir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-purple-50 rounded-lg px-4 py-2 mr-3 flex-row items-center">
            <MaterialIcons name="star-outline" size={18} color="#8B5CF6" style={{ marginRight: 6 }} />
            <Text className="text-purple-600 font-medium">Guardar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-green-50 rounded-lg px-4 py-2 mr-3 flex-row items-center">
            <MaterialIcons name="edit" size={18} color="#10B981" style={{ marginRight: 6 }} />
            <Text className="text-green-600 font-medium">Notas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="bg-amber-50 rounded-lg px-4 py-2 mr-3 flex-row items-center">
            <MaterialIcons name="report-problem" size={18} color="#F59E0B" style={{ marginRight: 6 }} />
            <Text className="text-amber-600 font-medium">Reportar</Text>
          </TouchableOpacity>
        </ScrollView>
        
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
          
          <TouchableOpacity className="bg-blue-500 py-3 flex-row items-center justify-center">
            <MaterialIcons name="videocam" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white font-medium">Vista en vivo</Text>
          </TouchableOpacity>
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