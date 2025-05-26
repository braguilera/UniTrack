import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';

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

// 🔁 Función común para agregar la campana
const withNotificationHeader = (navigation) => ({
    headerRight: () => (
        <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => navigation.navigate("NotificationStack")}
        >
            <Entypo name="bell" size={24} color="black" />
        </TouchableOpacity>
    ),
});

// 🔁 Stacks individuales con header y botón de notificación
function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen 
                name="HomeScreen" 
                component={HomeScreen}
                options={({ navigation }) => ({
                    title: "Home",
                    ...withNotificationHeader(navigation),
                })}
            />
        </HomeStack.Navigator>
    );
}

function RouteStackScreen() {
    return (
        <RouteStack.Navigator>
            <RouteStack.Screen 
                name="RouteScreen" 
                component={RouteScreen}
                options={({ navigation }) => ({
                    title: "Route",
                    ...withNotificationHeader(navigation),
                })}
            />
            <RouteStack.Screen 
                name="Map" 
                component={MapScreen}
                options={({ navigation }) => ({
                    title: "Map",
                    ...withNotificationHeader(navigation),
                })}
            />
        </RouteStack.Navigator>
    );
}

function CameraStackScreen() {
    return (
        <CameraStack.Navigator>
            <CameraStack.Screen 
                name="CameraScreen" 
                component={CameraScreen}
                options={({ navigation }) => ({
                    title: "Camera",
                    ...withNotificationHeader(navigation),
                })}
            />
        </CameraStack.Navigator>
    );
}

function InfoStackScreen() {
    return (
        <InfoStack.Navigator>
            <InfoStack.Screen 
                name="InformationScreen" 
                component={InformationScreen}
                options={({ navigation }) => ({
                    title: "Information",
                    ...withNotificationHeader(navigation),
                })}
            />
        </InfoStack.Navigator>
    );
}

function OptionsStackScreen() {
    return (
        <OptionsStack.Navigator>
            <OptionsStack.Screen 
                name="OptionsScreen" 
                component={OptionsScreen}
                options={({ navigation }) => ({
                    title: "Options",
                    ...withNotificationHeader(navigation),
                })}
            />
        </OptionsStack.Navigator>
    );
}

function NotificationStackScreen() {
    return (
        <NotificationStack.Navigator>
            <NotificationStack.Screen 
                name="NotificationScreen" 
                component={NotificationScreen}
                options={{ title: "Notifications" }}
            />
        </NotificationStack.Navigator>
    );
}

// 🔁 Tabs principales
function MyTabs() {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen
                name="Home"
                component={HomeStackScreen}
                options={{
                    tabBarLabel: 'Home',
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
                    tabBarLabel: 'Route',
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
                    tabBarLabel: 'Camera',
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
                    tabBarLabel: 'Information',
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
                    tabBarLabel: 'Options',
                    tabBarIcon: ({ color, size }) => (
                        <Entypo name="cog" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}

// 🔁 Stack raíz que engloba todo
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
