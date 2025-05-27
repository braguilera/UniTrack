import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Entypo, MaterialIcons, Ionicons } from '@expo/vector-icons';

const Camera = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center px-4 py-2 mt-8">
      </View>

      <View className="flex-1 justify-center items-center bg-gray-400 mx-4 my-4 rounded-lg">
        <Text className="text-white text-lg">Vista de Cámara</Text>
      </View>

      <View className="flex-row justify-around items-center py-4 mb-4">
        {/* Galería */}
        <TouchableOpacity className="p-3 bg-gray-300 rounded-full">
          <MaterialIcons name="photo-library" size={28} color="#6B7280" />
        </TouchableOpacity>

        {/* Captura */}
        <TouchableOpacity className="w-20 h-20 rounded-full border-4 border-gray-300 flex justify-center items-center">
          <View className="w-16 h-16 bg-gray-300 rounded-full"></View>
        </TouchableOpacity>

        {/* Flash */}
        <TouchableOpacity className="p-3 bg-gray-300 rounded-full">
          <MaterialIcons name="flash-on" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Camera;
