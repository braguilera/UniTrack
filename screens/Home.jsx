import React from 'react'
import { Text,TouchableOpacity,View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Home = () => {
  const navigation = useNavigation()

  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
        <Text className="text-2xl text-red-200 flex">Home</Text>
        <TouchableOpacity 
          className="bg-red-500 p-4 rounded-lg"
          onPress={() => navigation.navigate('Route')}
        >
          <Text className="text-white">Go to Route</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Home
