"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
// MODIFICACIÓN: Se importa Image
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from "react-native"
import Entypo from "@expo/vector-icons/Entypo"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"

// Importa tus screens aquí
import HomeScreen from "../screens/Home"
import CameraScreen from "../screens/Camera"
import OptionsScreen from "../screens/Options"
import InformationScreen from "../screens/Information"
import NotificationScreen from "../screens/Notification"
import RouteScreen from "../screens/Route"
import MapScreen from "../screens/Map"
import VirtualTourScreen from "../screens/VirtualTourScreen"

const { width } = Dimensions.get("window")

const Tab = createBottomTabNavigator()
const HomeStack = createNativeStackNavigator()
const RouteStack = createNativeStackNavigator()
const MapStack = createNativeStackNavigator()
const CameraStack = createNativeStackNavigator()
const InfoStack = createNativeStackNavigator()
const OptionsStack = createNativeStackNavigator()
const NotificationStack = createNativeStackNavigator()
const RootStack = createNativeStackNavigator()

// Componente de Navbar Flotante con 5 elementos
const FloatingNavBar = ({ state, descriptors, navigation }) => {
  const tabs = [
    { key: "Home", icon: "home", label: "Inicio" },
    { key: "Route", icon: "location", label: "Ruta" },
    // { key: "Camera", icon: "camera", label: "Cámara" },
    { key: "Information", icon: "info", label: "Información" },
    // { key: "Options", icon: "cog", label: "Opciones" },
  ]

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.floatingNavBar}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: state.routes[index].key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(state.routes[index].name)
            }
          }

          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.floatingTabButton, isFocused && styles.activeFloatingTab]}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Entypo name={tab.icon} size={18} color={isFocused ? "#000000" : "#FFFFFF"} />
              <Text style={[styles.tabLabel, { color: isFocused ? "#000000" : "#FFFFFF" }]}>{tab.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

// Header con notificaciones
// const withNotificationHeader = (navigation, badgeCount = 3) => ({
//   headerRight: () => (
//     <TouchableOpacity
//       style={{ marginRight: 15, width: 40, height: 40, justifyContent: "center", alignItems: "center" }}
//       onPress={() => navigation.navigate("NotificationStack")}
//     >
//       <View>
//         <MaterialCommunityIcons name="bell" size={24} color={badgeCount > 0 ? "#374151" : "#A1A1AA"} />
//         {badgeCount > 0 && (
//           <View style={styles.notificationBadge}>
//             <Text style={styles.badgeText}>{badgeCount}</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   ),
// })

// Home Stack
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation }) => ({
          // MODIFICACIÓN: Se reemplaza `title` con `headerTitle` para usar un componente personalizado
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                // Asegúrate de que esta ruta sea correcta desde la ubicación de tu archivo de navegación
                source={require('../assets/images/LogoUniTrack.png')}
                style={{ width: 32, height: 32, marginRight: 0 }}
                resizeMode="contain"
              />
              <Image
                // Ruta de la imagen del título UniTrack
                source={require('../assets/images/UniTrackTitulo.png')}
                style={{ width: 120, height: 32, resizeMode: 'contain', marginLeft: -25 }} // Ajusta el tamaño según sea necesario
              />
            </View>
          ),
          //...withNotificationHeader(navigation),
        })}
      />
    </HomeStack.Navigator>
  )
}

// Route Stack
function RouteStackScreen() {
  return (
    <RouteStack.Navigator>
      <RouteStack.Screen
        name="RouteScreen"
        component={RouteScreen}
        options={({ navigation }) => ({
          title: "Trazar ruta",
          //...withNotificationHeader(navigation),
        })}
      />
      <RouteStack.Screen
        name="Map"
        component={MapScreen}
        options={({ navigation }) => ({
          title: "Mapa",
          //...withNotificationHeader(navigation),
        })}
      />
      {/* <RouteStack.Screen
        name="Camara"
        component={CameraStackScreen}
        options={({ navigation }) => ({
          title: "Cámara",
          ...withNotificationHeader(navigation),
        })}
      /> */}
    </RouteStack.Navigator>
  )
}

// Camera Stack
//function CameraStackScreen() {
//  return (
//    <CameraStack.Navigator>
//      <CameraStack.Screen
//        name="CameraScreen"
//        component={CameraScreen}
//        options={({ navigation }) => ({
//          title: "Camara",
//          ...withNotificationHeader(navigation),
//        })}
//      />
//    </CameraStack.Navigator>
//  )
//}

// Information Stack
function InfoStackScreen() {
  return (
    <InfoStack.Navigator>
      <InfoStack.Screen
        name="InformationScreen"
        component={InformationScreen}
        options={({ navigation }) => ({
          title: "Información",
          //...withNotificationHeader(navigation),
        })}
      />
    </InfoStack.Navigator>
  )
}

// Options Stack
function OptionsStackScreen() {
  return (
    <OptionsStack.Navigator>
      <OptionsStack.Screen
        name="OptionsScreen"
        component={OptionsScreen}
        options={({ navigation }) => ({
          title: "Opciones",
          //...withNotificationHeader(navigation),
        })}
      />
      <OptionsStack.Screen
        name="Tour Virtual"
        component={VirtualTourScreen}
        options={{
          headerShown: false,
          title: "Tour Virtual",
        }}
      />
    </OptionsStack.Navigator>
  )
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
  )
}

// Tabs con navbar flotante personalizada
function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Home" tabBar={(props) => <FloatingNavBar {...props} />}>
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: "Inicio", headerShown: false }} />
      <Tab.Screen name="Route" component={RouteStackScreen} options={{ tabBarLabel: "Ruta", headerShown: false }} />
      {/* <Tab.Screen name="Camera" component={CameraStackScreen} options={{ tabBarLabel: "Cámara", headerShown: false }} /> */}
      <Tab.Screen name="Information" component={InfoStackScreen} options={{ tabBarLabel: "Información", headerShown: false }} />
      <Tab.Screen name="Options" component={OptionsStackScreen} options={{ tabBarLabel: "Opciones", headerShown: false }} />
    </Tab.Navigator>
  )
}

// Componente principal de navegación
export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="MainTabs" component={MyTabs} />
        <RootStack.Screen name="NotificationStack" component={NotificationStackScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

// Estilos
const styles = StyleSheet.create({
  floatingContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
    backgroundColor: "transparent",
  },
  floatingNavBar: {
    flexDirection: "row",
    backgroundColor: "rgba(135, 206, 235, 0.8)",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    width: width * 0.95,
    justifyContent: "space-around",
    alignItems: "center",
  },
  floatingTabButton: {
    padding: 6,
    borderRadius: 20,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  activeFloatingTab: {
    backgroundColor: "#FFFFFF",
    transform: [{ scale: 1.05 }],
  },
  tabLabel: {
    fontSize: 7,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  notificationBadge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
})
