import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Entypo from '@expo/vector-icons/Entypo';

//screens
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

function MyStackHome() {
    return (
        <HomeStack.Navigator initialRouteName="HomeScreen">
            <HomeStack.Screen 
                name="HomeScreen" 
                component={HomeScreen} 
                options={{
                    headerTitle: '', // Sin título
                    headerShown: false, // Oculta el header del stack en HomeScreen
                }}
            />
            <HomeStack.Screen 
                name="Route" 
                component={MyStackRoute} 
                options={{
                    headerShown: false, // Oculta el header del stack en Route (ya que Route es otro stack)
                }}
            />
        </HomeStack.Navigator>
    );
}

function MyStackRoute() {
    return (
        <RouteStack.Navigator initialRouteName="RouteScreen">
            <RouteStack.Screen 
                name="RouteScreen" 
                component={RouteScreen}
                options={{
                    headerTitle: '', // Sin título
                    headerBackTitleVisible: false, // Oculta el texto del botón atrás
                }}
            />
            <RouteStack.Screen 
                name="Map" 
                component={MapScreen}
                options={{
                    headerTitle: '', // Sin título
                    headerBackTitleVisible: false, // Oculta el texto del botón atrás
                }}
            />
        </RouteStack.Navigator>
    );
}

//tabBarBadge is used to show the number of notifications

function MyTabs() {
    return(
        <Tab.Navigator
            initialRouteName="Home"
            screesOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home" 
                component={MyStackHome} 
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="home" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />

            <Tab.Screen 
                name="Notification" 
                component={NotificationScreen} 
                options={{
                    tabBarLabel: 'Notification',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="notification" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            
            <Tab.Screen 
                name="Camera" 
                component={CameraScreen} 
                options={{
                    tabBarLabel: 'Camera',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="camera" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />

            <Tab.Screen 
                name="Information" 
                component={InformationScreen} 
                options={{
                    tabBarLabel: 'Information',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="info" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />

            <Tab.Screen 
                name="Options" 
                component={OptionsScreen} 
                options={{
                    tabBarLabel: 'Options',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="cog" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    )
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}