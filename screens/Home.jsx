import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Importa los componentes de mapa individuales
import IndexMap from '../components/IndexMap';
import Independencia1Map from '../components/Independencia1Map';
import Independencia2Map from '../components/Independencia2Map';

const HomeScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedFriend, setSelectedFriend] = useState('');
    const [showFriendsList, setShowFriendsList] = useState(false);
    const [activeButton, setActiveButton] = useState('mapa2d');
    const [activeMap, setActiveMap] = useState('index'); 
    const navigation = useNavigation();

    const friends = ['María González', 'Carlos Rodríguez', 'Ana López', 'Diego Martínez', 'Sofia Hernández'];

    // Esta función decide qué mapa renderizar basado en el estado 'activeMap'
    const renderActiveMap = () => {
        switch (activeMap) {
            case 'independencia1':
                return <Independencia1Map onGoBack={() => setActiveMap('index')} />;
            case 'independencia2':
                return <Independencia2Map onGoBack={() => setActiveMap('index')} />;
            case 'index':
            default:
                return <IndexMap onSelectBuilding={(building) => setActiveMap(building)} />;
        }
    };
    
    // Navega a la pantalla de rutas al buscar
    const handleSearch = () => {
        if (searchText.trim()) {
            navigation.navigate('Route', {
                screen: 'TrazarRuta',
                params: { originText: searchText },
            });
        } else {
            Alert.alert("Búsqueda vacía", "Por favor, ingresa un destino.");
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-white px-6 pt-4 pb-6 shadow-sm">
                {/* Search Bar */}
                {/* <View className="relative">
                    <View className="absolute left-4 top-4 z-10">
                        <MaterialIcons name="place" size={20} color="#9CA3AF" />
                    </View>
                    <TextInput
                        placeholder="¿A dónde quieres ir?"
                        value={searchText}
                        onChangeText={setSearchText}
                        className="bg-gray-100 rounded-xl pl-12 pr-16 py-4 text-gray-700 text-base"
                        placeholderTextColor="#9CA3AF"
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity
                        onPress={handleSearch}
                        className="absolute right-3 top-2 bg-blue-600 rounded-lg p-2"
                    >
                        <MaterialIcons name="search" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View> */}

                {/* Share Location Dropdown */}
                {/* <TouchableOpacity
                    onPress={() => setShowFriendsList(!showFriendsList)}
                    className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-4 flex-row items-center justify-between"
                >
                    <View className="flex-row items-center">
                        <MaterialIcons name="people" size={20} color="#2563EB" style={{ marginRight: 12 }} />
                        <Text className="text-blue-700 font-medium">
                            {selectedFriend || 'Compartir ubicación con'}
                        </Text>
                    </View>
                    <MaterialIcons
                        name={showFriendsList ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={20}
                        color="#2563EB"
                    />
                </TouchableOpacity> */}

                {/* Friends Dropdown */}
                {showFriendsList && (
                    <View className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                        <ScrollView className="max-h-48">
                            {friends.map((friend, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setSelectedFriend(friend);
                                        setShowFriendsList(false);
                                    }}
                                    className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                                >
                                    <Text className="text-gray-700 font-medium">{friend}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity className="px-4 py-3 flex-row items-center">
                                <MaterialIcons name="add" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                                <Text className="text-blue-600 font-medium">Agregar amigo</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* Map Placeholder Dinámico */}
            <View className="flex-1 mx-6 my-6">
                <View className="flex-1 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {renderActiveMap()}
                </View>
            </View>

            {/* Bottom Action Buttons */}
            <View className="px-6 pb-8">
                <View className="bg-white rounded-2xl shadow-lg p-2 flex-row">
                    <TouchableOpacity
                        onPress={() => {
                            setActiveButton('mapa2d');
                            setActiveMap('index');
                        }}
                        className={`flex-1 py-4 px-6 rounded-xl flex-row items-center justify-center ${activeButton === 'mapa2d' ? 'bg-blue-600 shadow-md' : 'bg-transparent'}`}
                    >
                        <MaterialIcons
                            name="map"
                            size={20}
                            color={activeButton === 'mapa2d' ? '#FFFFFF' : '#4B5563'}
                            style={{ marginRight: 8 }}
                        />
                        <Text className={`font-semibold ${activeButton === 'mapa2d' ? 'text-white' : 'text-gray-600'}`}>
                            Mapa 2D
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-1 py-4 px-6 rounded-xl flex-row items-center justify-center ${activeButton === 'concurrencia' ? 'bg-purple-600 shadow-md' : 'bg-transparent'}`}
                    >
                        <MaterialIcons
                            name="groups"
                            size={20}
                            color={activeButton === 'concurrencia' ? '#FFFFFF' : '#4B5563'}
                            style={{ marginRight: 8 }}
                        />
                        <Text className={`font-semibold ${activeButton === 'concurrencia' ? 'text-white' : 'text-gray-600'}`}>
                            Concurrencia
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default HomeScreen;
