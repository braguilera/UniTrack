import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';

const Information = () => {
  const categories = [
    {
      title: 'Opciones Gastronómicas',
      items: [
        { label: 'Cocina Petersen', info: 'Information for Cocina Petersen' },
        { label: 'La cantina', info: 'Information for La cantina' },
        { label: 'Rústica', info: 'Information for Rústica' },
        { label: 'Starbucks', info: 'Information for Starbucks' },
      ],
    },
    {
      title: 'Expendedoras',
      items: [
        { label: 'Café', info: 'Lima 1: Primer subsuelo\nLima 3: Pisos 2, 3, 4, 5, 6, 7, 8 y 9\nUade Labs: Piso 6' },
        { label: 'Agua Caliente', info: 'Information for Agua Caliente' },
        { label: 'Agua Fría', info: 'Information for Agua Fría' },
        { label: 'Gaseosas', info: 'Information for Gaseosas' },
      ],
    },
    {
      title: 'Otros',
      items: [
        { label: 'Santander', info: 'Information for Santander' },
        { label: 'Bookstore Temas', info: 'Information for Bookstore Temas' },
        { label: 'Ascensores', info: 'Information for Ascensores' },
        { label: 'Salidas de emergencia', info: 'Information for Salidas de emergencia' },
        { label: 'Estacionamiento', info: 'Information for Estacionamiento' },
        { label: 'Medicus', info: 'Information for Medicus' },
        { label: 'Centro de copiado', info: 'Information for Centro de copiado' },
        { label: 'Recarga sube', info: 'Information for Recarga sube' },
        { label: 'UADE Store', info: 'Information for UADE Store' },
      ],
    },
  ];

  const [selectedInfo, setSelectedInfo] = useState('');
  const [selectedButtonLabel, setSelectedButtonLabel] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: isModalVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: isModalVisible ? 1 : 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isModalVisible]);

  const handleButtonPress = (info, label) => {
    setSelectedInfo(info);
    setSelectedButtonLabel(label);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView className="flex-1">
      <View className="px-5 pt-16">
        <Text className="text-4xl font-bold mb-5">Información</Text>
        <View className="h-px bg-gray-300 my-4 w-full" />
        {categories.map((category, index) => (
          <View key={index} className="mb-5">
            <Text className="text-lg font-bold mb-2">{category.title}</Text>
            <View className="flex-row flex-wrap">
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  className={`bg-gray-100 py-2 px-4 rounded-xl mr-2 mb-2 border ${
                    selectedButtonLabel === item.label
                      ? 'bg-gray-200 border-gray-500'
                      : 'border-gray-300'
                  }`}
                  onPress={() => handleButtonPress(item.info, item.label)}
                >
                  <Text className={`${selectedButtonLabel === item.label ? 'font-bold' : ''}`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {index < categories.length - 1 && <View className="h-px bg-gray-300 my-4 w-full" />}
          </View>
        ))}
      </View>

      <Modal transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={{
              opacity: modalOpacity,
              transform: [{ scale: modalScale }],
            }}
            className="bg-white rounded-xl p-5 w-4/5 items-center"
          >
            <Text className="text-xl font-bold mb-4">
              {selectedButtonLabel || 'Información'}
            </Text>
            <Text className="text-base mb-5 text-center leading-6">
              {selectedInfo || 'Selecciona una opción.'}
            </Text>
            <TouchableOpacity
              className="bg-gray-300 py-2 px-5 rounded"
              onPress={closeModal}
            >
              <Text className="text-base font-bold">Cerrar</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default Information;
