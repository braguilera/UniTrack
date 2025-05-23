import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import "./global.css"

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-2xl text-red-200 flex">Open up App.js to start working on your app!</Text>
      <Text className="text-2xl text-red-200 flex">Open up App.js to start working on your app!</Text>
      <Text className=""></Text>
      <StatusBar style="auto" />
    </View>
  );
}

