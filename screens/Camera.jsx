import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons'; // Import icons from Expo

const Camera = () => {
  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Barra superior sin iconos de ajustes y flash */}
      <View className="flex-row justify-between items-center px-4 py-2 mt-8">
        {/* Este View ahora está vacío o puedes añadir otros elementos si es necesario */}
      </View>

      {/* Marcador de posición para la vista de la cámara */}
      <View className="flex-1 justify-center items-center bg-gray-700 mx-4 my-4 rounded-lg">
        <Text className="text-white text-lg">Vista de Cámara (Marcador de Posición)</Text>
      </View>

      {/* Barra inferior con iconos de galería, captura y cambio de cámara */}
      <View className="flex-row justify-around items-center py-4 mb-4">
        {/* Icono de Galería */}
        <TouchableOpacity className="p-3 bg-gray-800 rounded-full">
          <MaterialIcons name="photo-library" size={28} color="white" />
        </TouchableOpacity>

        {/* Botón de Captura */}
        <TouchableOpacity className="w-20 h-20 rounded-full border-4 border-white flex justify-center items-center">
          <View className="w-16 h-16 bg-white rounded-full"></View>
        </TouchableOpacity>

        {/* Icono de Cambio de Cámara */}
        <TouchableOpacity className="p-3 bg-gray-800 rounded-full">
          <MaterialIcons name="flash-on" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Camera;
