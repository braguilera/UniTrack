import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Image, Modal, Animated, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

const Camera = () => {
  const [cameraType, setCameraType] = useState('back'); // back, front
  const [flashMode, setFlashMode] = useState('off'); // off, on, auto
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [flashAnimation] = useState(new Animated.Value(0));
  const [captureAnimation] = useState(new Animated.Value(1));

  const toggleCamera = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back');
  };

  const toggleFlash = () => {
    const modes = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(flashMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlashMode(modes[nextIndex]);
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case 'on': return 'flash-on';
      case 'auto': return 'flash-auto';
      default: return 'flash-off';
    }
  };

  const handleCapture = () => {
    // Efecto de captura - Flash blanco
    Animated.sequence([
      Animated.timing(flashAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(flashAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();

    // Efecto del botón de captura
    Animated.sequence([
      Animated.timing(captureAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(captureAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Mostrar modal después del efecto
    setTimeout(() => {
      setShowLocationModal(true);
    }, 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* Header Controls */}
      <View className="flex-row justify-between items-center px-6 py-4 mt-2">
        <TouchableOpacity className="p-2">
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        
        <View className="flex-row space-x-4">
          {/* Flash */}
          <TouchableOpacity 
            onPress={toggleFlash}
            className={`p-2 rounded-full ${flashMode !== 'off' ? 'bg-yellow-500' : 'bg-black/30'}`}
          >
            <MaterialIcons 
              name={getFlashIcon()} 
              size={24} 
              color={flashMode !== 'off' ? "black" : "white"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Camera View */}
      <View className="flex-1 bg-gray-900 mx-4 rounded-2xl overflow-hidden relative">
        {/* Camera View with QR Background */}
        <Image 
          source={require('../assets/images/QR.png')}
          className="flex-1 w-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/10" />

        {/* Flash Effect Overlay */}
        <Animated.View 
          className="absolute inset-0 bg-white"
          style={{
            opacity: flashAnimation,
          }}
        />

        {/* Camera Overlay */}
        <View className="absolute inset-0">
          {/* Grid Lines */}
          <View className="flex-1 flex-row">
            <View className="flex-1 border-r border-white/20" />
            <View className="flex-1 border-r border-white/20" />
            <View className="flex-1" />
          </View>
          <View className="absolute inset-0 flex-col">
            <View className="flex-1 border-b border-white/20" />
            <View className="flex-1 border-b border-white/20" />
            <View className="flex-1" />
          </View>
        </View>

        {/* Center Focus Indicator */}
        <View className="absolute inset-0 justify-center items-center">
          <View className="w-20 h-20 border-2 border-white rounded-lg opacity-60" />
        </View>

        {/* Camera Type Indicator */}
        <View className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full">
          <Text className="text-white text-sm">
            {cameraType === 'front' ? 'Frontal' : 'Trasera'}
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      {/* MODIFICACIÓN: Se cambia justify-between por justify-center para centrar el botón */}
      <View className="flex-row justify-center items-center px-8 py-6">
        {/* Capture Button with Animation */}
        <Animated.View style={{ transform: [{ scale: captureAnimation }] }}>
          <TouchableOpacity 
            onPress={handleCapture}
            className="w-20 h-20 rounded-full border-4 border-white justify-center items-center"
          >
            <View className="w-16 h-16 rounded-full bg-white" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Location Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showLocationModal}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 mx-8 shadow-2xl">
            {/* Header with Icon */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-blue-100 rounded-full justify-center items-center mb-3">
                <FontAwesome5 name="map-marker-alt" size={28} color="#3B82F6" />
              </View>
              <Text className="text-xl font-bold text-gray-800 text-center">
                En futuras actualizaciones
              </Text>
            </View>

            {/* OK Button */}
            <TouchableOpacity
              onPress={() => setShowLocationModal(false)}
              className="bg-blue-600 rounded-xl py-3 px-6 shadow-lg"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Entendido
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingBottom: 80, // Espacio para evitar que la navbar tape los controles
    }
});

export default Camera;
