import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'; 

const Options = () => {
  const [soundGuideEnabled, setSoundGuideEnabled] = useState(false);
  const [collaborativeAnnotationsEnabled, setCollaborativeAnnotationsEnabled] = useState(false);

  return (
    <ScrollView className="flex-1"> 
      <View className="px-5 pt-16">
        <Text className="text-4xl font-bold mb-5 text-gray-800">Opciones</Text>
        <View className="h-px bg-gray-300 my-4 w-full" />

        {/* Opción: Tour virtual */}
        <TouchableOpacity className="flex-row items-center py-4" onPress={() => console.log('Tour virtual pressed')}>
          <MaterialCommunityIcons name="map-marker-path" size={28} color="#4B5563" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-gray-800">Tour virtual</Text>
            <Text className="text-sm text-gray-600 mt-1">Explora la universidad con un tour virtual completo</Text>
          </View>
          <AntDesign name="right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <View className="h-px bg-gray-200 w-full" />

        {/* Opción: Mapa sin conexión */}
        <TouchableOpacity className="flex-row items-center py-4" onPress={() => console.log('Descargar mapa pressed')}>
          <MaterialIcons name="wifi-off" size={24} color="black" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-gray-800">Mapa sin conexión</Text>
            <Text className="text-sm text-gray-600 mt-1">Descarga el mapa para usarlo sin internet</Text>
          </View>
          <MaterialIcons name="file-download" size={30} color="#000000" />
        </TouchableOpacity>
        <View className="h-px bg-gray-200 w-full" />

        {/* Opción: Guía con sonido */}
        <View className="flex-row items-center py-4">
          <Ionicons name="volume-high-outline" size={28} color="#4B5563" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-gray-800">Guía con sonido</Text>
            <Text className="text-sm text-gray-600 mt-1">Activar guía con sonido</Text>
          </View>
          <Switch
            trackColor={{ false: "#E5E7EB", true: "#6B7280" }}
            thumbColor={"#FFFFFF"}
            ios_backgroundColor="#E5E7EB"
            onValueChange={() => setSoundGuideEnabled(previousState => !previousState)}
            value={soundGuideEnabled}
          />
        </View>
        <View className="h-px bg-gray-200 w-full" />

        {/* Opción: Anotaciones colaborativas */}
        <View className="flex-row items-center py-4">
          <MaterialCommunityIcons name="pencil-box-outline" size={28} color="#4B5563" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-gray-800">Anotaciones colaborativas</Text>
            <Text className="text-sm text-gray-600 mt-1">Activar anotaciones colaborativas</Text>
          </View>
          <Switch
            trackColor={{ false: "#E5E7EB", true: "#6B7280" }}
            thumbColor={"#FFFFFF"}
            ios_backgroundColor="#E5E7EB"
            onValueChange={() => setCollaborativeAnnotationsEnabled(previousState => !previousState)}
            value={collaborativeAnnotationsEnabled}
          />
        </View>
        <View className="h-px bg-gray-200 w-full" />

      </View>
    </ScrollView>
  );
};

export default Options;
