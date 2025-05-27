import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, Text } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from "../screens/Home";
import CameraScreen from "../screens/Camera";
import OptionsScreen from "../screens/Options";
import InformationScreen from "../screens/Information";
import NotificationScreen from "../screens/Notification";
import RouteScreen from "../screens/Route";
import MapScreen from "../screens/Map";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const RouteStack = createNativeStackNavigator();
const MapStack = createNativeStackNavigator();
const CameraStack = createNativeStackNavigator();
const InfoStack = createNativeStackNavigator();
const OptionsStack = createNativeStackNavigator();
const NotificationStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

// Notificaction
const withNotificationHeader = (navigation, badgeCount = 3) => ({
    headerRight: () => (
        <TouchableOpacity
            style={{ marginRight: 15, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate("NotificationStack")}
        >
            <View>
                <MaterialCommunityIcons
                    name="bell"
                    size={24}
                    color={badgeCount > 0 ? "#374151" : "#A1A1AA"} // gris oscuro si hay, gris claro si no hay
                />
                {badgeCount > 0 && (
                    <View
                        style={{
                            position: 'absolute',
                            right: -6,
                            top: -4,
                            backgroundColor: 'red',
                            borderRadius: 8,
                            width: 16,
                            height: 16,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                            {badgeCount}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    ),
});

// Home
function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen 
                name="HomeScreen" 
                component={HomeScreen}
                options={({ navigation }) => ({
                    title: "Inicio",
                    ...withNotificationHeader(navigation),
                })}
            />
        </HomeStack.Navigator>
    );
}

// Route
function RouteStackScreen() {
    return (
        <RouteStack.Navigator>
            <RouteStack.Screen 
                name="RouteScreen" 
                component={RouteScreen}
                options={({ navigation }) => ({
                    title: "Trazar ruta",
                    ...withNotificationHeader(navigation),
                })}
            />
            <RouteStack.Screen 
                name="Map" 
                component={MapScreen}
                options={({ navigation }) => ({
                    title: "Mapa",
                    ...withNotificationHeader(navigation),
                })}
            />
            <RouteStack.Screen 
                name="Camara" 
                component={CameraStackScreen}
                options={({ navigation }) => ({
                    title: "Camara",
                    ...withNotificationHeader(navigation),
                })}
            />
        </RouteStack.Navigator>
    );
}

// Camera
function CameraStackScreen() {
    return (
        <CameraStack.Navigator>
            <CameraStack.Screen 
                name="CameraScreen" 
                component={CameraScreen}
                options={({ navigation }) => ({
                    title: "Camara",
                    ...withNotificationHeader(navigation),
                })}
            />
        </CameraStack.Navigator>
    );
}

// Information
function InfoStackScreen() {
    return (
        <InfoStack.Navigator>
            <InfoStack.Screen 
                name="InformationScreen" 
                component={InformationScreen}
                options={({ navigation }) => ({
                    title: "Información",
                    ...withNotificationHeader(navigation),
                })}
            />
        </InfoStack.Navigator>
    );
}

// Options
function OptionsStackScreen() {
    return (
        <OptionsStack.Navigator>
            <OptionsStack.Screen 
                name="OptionsScreen" 
                component={OptionsScreen}
                options={({ navigation }) => ({
                    title: "Opciones",
                    ...withNotificationHeader(navigation),
                })}
            />
        </OptionsStack.Navigator>
    );
}

// Notification Stack
function NotificationStackScreen() {
    return (
        <NotificationStack.Navigator>
            <NotificationStack.Screen 
                name="NotificationScreen" 
                component={NotificationScreen}
                options={{ 
                    title: "Notificaciones", 
                    tabBarBadge: 3,
                }}
            />
        </NotificationStack.Navigator>
    );
}

// Tabs 
function MyTabs() {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={HomeStackScreen}
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="home" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Route"
                component={RouteStackScreen}
                options={{
                    tabBarLabel: 'Ruta',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="location" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Camera"
                component={CameraStackScreen}
                options={{
                    tabBarLabel: 'Camara',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="camera" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Information"
                component={InfoStackScreen}
                options={{
                    tabBarLabel: 'Información',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="info" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Options"
                component={OptionsStackScreen}
                options={{
                    tabBarLabel: 'Opciones',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="cog" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="MainTabs" component={MyTabs} />
                <RootStack.Screen name="NotificationStack" component={NotificationStackScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
