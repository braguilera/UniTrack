import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import "./global.css"

import Navigation from "./navigation/Navigation";
import { BLEProvider } from './services/BLEProvider';

export default function App() {
  return (
    <BLEProvider>
      <Navigation />
    </BLEProvider>
  );
}

