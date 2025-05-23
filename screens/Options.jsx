import React from 'react'
import { ScrollView, Text,View } from 'react-native'

const Options = () => {
  return (
    <ScrollView className="flex-1">
      <View className="px-5 pt-16">
        <Text className="text-4xl font-bold mb-5">Options</Text>
        <View className="h-px bg-gray-300 my-4 w-full" />
    </View>
    </ScrollView>
  )
}

export default Options
