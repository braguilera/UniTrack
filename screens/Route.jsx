import React from 'react'
import { Text,TouchableOpacity,View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Route = () => {
  const navigation = useNavigation()
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
        <Text className="text-2xl text-red-200 flex">Route</Text>
          <TouchableOpacity className="bg-purple-500 p-4 rounded-lg"
            onPress={() => navigation.navigate('Map')}
          >
            <Text className="text-white">Go to Map</Text>
          </TouchableOpacity>
    </View>
  )
}

export default Route
