"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated, SafeAreaView, StatusBar } from "react-native"
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons"
import { useBLEContext } from "../services/BLEProvider" // Asegúrate que la ruta a tu provider sea correcta

const Information = () => {
  const navigation = useNavigation()
  const { setRouteDestination } = useBLEContext()

  const categories = [
    {
      title: "Opciones Gastronómicas",
      icon: "restaurant",
      iconType: "material",
      color: "#FF6B6B",
      items: [
        {
          label: "Cocina Petersen",
          info: "Restaurante principal de la universidad con variedad de platos caseros y menús ejecutivos. Horario: 11:30 - 15:00 hs.",
          icon: "chef-hat",
          iconType: "fontawesome",
        },
        {
          label: "La Cantina",
          info: "Espacio informal para comidas rápidas, sandwiches y snacks. Ideal para un almuerzo ligero entre clases.",
          icon: "coffee",
          iconType: "fontawesome",
        },
        {
          label: "Rústica",
          info: "Panadería y confitería con productos frescos, medialunas, café y dulces artesanales.",
          icon: "bread-slice",
          iconType: "fontawesome",
        },
        {
          label: "Starbucks",
          info: "Cafetería internacional con café premium, frappés, tés y snacks. Perfecto para estudiar.",
          icon: "coffee",
          iconType: "material",
        },
      ],
    },
    {
      title: "Expendedoras",
      icon: "local-drink",
      iconType: "material",
      color: "#4ECDC4",
      items: [
        {
          label: "Café",
          info: "Independencia 1: ⬆️ 5\nLima 1: ⬆️ Primer subsuelo\nLima 3: ⬆️ 2, 3, 4, 5, 6, 7, 8 y 9\nUade Labs: ⬆️ 6\nStarbucks: patio\n\nCafé caliente disponible las 24 horas.",
          icon: "local-cafe",
          iconType: "material",
        },
        {
          label: "Agua Caliente",
          info: "Dispensadores de agua caliente ubicados en cada piso para preparar infusiones y mates.",
          icon: "hot-tub",
          iconType: "material",
        },
        {
          label: "Agua Fría",
          info: "Dispensadores de agua fría purificada disponibles en todas las plantas del edificio.",
          icon: "water-drop",
          iconType: "material",
        },
        {
          label: "Gaseosas",
          info: "Máquinas expendedoras con variedad de bebidas gaseosas, jugos y energizantes.",
          icon: "wine-bottle",
          iconType: "fontawesome",
        },
      ],
    },
    {
      title: "Servicios y Otros",
      icon: "business",
      iconType: "material",
      color: "#45B7D1",
      items: [
        {
          label: "Santander",
          info: "Cajero automático y servicios bancarios. Ubicado en planta baja, sector Lima.",
          icon: "university",
          iconType: "fontawesome",
        },
        {
          label: "Bookstore Temas",
          info: "Librería universitaria con textos académicos, materiales de estudio y artículos de papelería.",
          icon: "book",
          iconType: "material",
        },
        {
          label: "Ascensores",
          info: "Sistema de ascensores disponible en todos los edificios. Prioridad para personas con movilidad reducida.",
          icon: "elevator",
          iconType: "material",
        },
        {
          label: "Salidas de Emergencia",
          info: "Salidas de emergencia señalizadas en cada piso. Mantener siempre despejadas.",
          icon: "emergency-exit",
          iconType: "material",
        },
        {
          label: "Estacionamiento",
          info: "Estacionamiento disponible para estudiantes y personal. Consultar tarifas en administración.",
          icon: "local-parking",
          iconType: "material",
        },
        {
          label: "Medicus",
          info: "Centro médico universitario. Atención de primeros auxilios y consultas básicas.",
          icon: "local-hospital",
          iconType: "material",
        },
        {
          label: "Centro de Copiado",
          info: "Servicio de fotocopias, impresiones y encuadernación. Ubicado en planta baja.",
          icon: "print",
          iconType: "material",
        },
        {
          label: "Recarga SUBE",
          info: "Terminal para recarga de tarjeta SUBE. Disponible las 24 horas.",
          icon: "credit-card",
          iconType: "material",
        },
        {
          label: "UADE Store",
          info: "Tienda oficial con merchandising, ropa y accesorios de la universidad.",
          icon: "store",
          iconType: "material",
        },
      ],
    },
  ]

  const [selectedInfo, setSelectedInfo] = useState("")
  const [selectedButtonLabel, setSelectedButtonLabel] = useState(null)
  const [selectedIcon, setSelectedIcon] = useState(null)
  const [selectedIconType, setSelectedIconType] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const modalOpacity = useRef(new Animated.Value(0)).current
  const modalScale = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: isModalVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: isModalVisible ? 1 : 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [isModalVisible])

  const handleNavigateToFloor = (destinationId) => {
    console.log(`Estableciendo "${destinationId}" en el contexto y navegando...`)
    setRouteDestination(destinationId)
    closeModal()
    navigation.navigate('Route')
  }

  const handleButtonPress = (info, label, icon, iconType) => {
    setSelectedInfo(info)
    setSelectedButtonLabel(label)
    setSelectedIcon(icon)
    setSelectedIconType(iconType)
    setIsModalVisible(true)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const renderIcon = (iconName, iconType, size = 24, color = "#666") => {
    switch (iconType) {
      case "material":
        return <MaterialIcons name={iconName} size={size} color={color} />
      case "fontawesome":
        return <FontAwesome5 name={iconName} size={size} color={color} />
      case "ionicons":
        return <Ionicons name={iconName} size={size} color={color} />
      default:
        return <MaterialIcons name="info" size={size} color={color} />
    }
  }

  const patioIcon = <MaterialIcons name="deck" size={16} color="#4B5563" />

  const renderTextWithIcons = (text) => {
    if (text.includes("patio")) {
      const parts = text.split("patio")
      return (
        <View className="flex-row flex-wrap items-center">
          {parts.map((part, index) => (
            <View key={index} className="flex-row items-center">
              <Text className="text-gray-800 leading-6 font-medium">{part}</Text>
              {index < parts.length - 1 && (
                <View className="flex-row items-center">
                  {patioIcon}
                  <Text className="text-gray-800 leading-6 font-medium ml-1">patio</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )
    }

    const parts = text.split(/(🏢|⬆️|⬇️|🕞|horas)/g)

    return (
      <View className="flex-row flex-wrap items-center">
        {parts.map((part, index) => {
          switch (part) {
            case "🏢":
              return (
                <View key={index} className="mr-1">
                  <MaterialIcons name="business" size={16} color="#4B5563" />
                </View>
              )
            case "⬆️":
            case "⬇️":
              return (
                <View key={index} className="mr-1">
                  <MaterialIcons name="layers" size={16} color="#4B5563" />
                </View>
              )
            case "🕞":
            case "horas":
              return (
                <View key={index} className="mr-1">
                  <MaterialIcons name="access-time" size={16} color="#4B5563" />
                </View>
              )
            default:
              return part ? (
                <Text key={index} className="text-gray-800 leading-6 font-medium">
                  {part}
                </Text>
              ) : null
          }
        })}
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View className="bg-white px-6 py-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">Información del Campus</Text>
        <Text className="text-gray-600 mt-1">Encuentra todos los servicios disponibles</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View className="px-4 py-6">
          {categories.map((category, categoryIndex) => (
            <View key={categoryIndex} className="mb-8">
              <View className="flex-row items-center mb-4">
                <View
                  className="w-12 h-12 rounded-full justify-center items-center mr-3"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  {renderIcon(category.icon, category.iconType, 24, category.color)}
                </View>
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800">{category.title}</Text>
                  <Text className="text-gray-500 text-sm">{category.items.length} opciones disponibles</Text>
                </View>
              </View>

              <View className="bg-white rounded-2xl shadow-sm p-4">
                <View className="flex-row flex-wrap">
                  {category.items.map((item, itemIndex) => (
                    <TouchableOpacity
                      key={item.label}
                      className={`flex-row items-center bg-gray-50 py-3 px-4 rounded-xl mr-2 mb-3 border-2 ${
                        selectedButtonLabel === item.label ? "border-blue-500 bg-blue-50" : "border-transparent"
                      }`}
                      onPress={() => handleButtonPress(item.info, item.label, item.icon, item.iconType)}
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <View className="mr-2">
                        {renderIcon(
                          item.icon,
                          item.iconType,
                          18,
                          selectedButtonLabel === item.label ? "#3B82F6" : "#6B7280",
                        )}
                      </View>
                      <Text
                        className={`text-sm ${
                          selectedButtonLabel === item.label
                            ? "font-semibold text-blue-700"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal transparent={true} visible={isModalVisible} onRequestClose={closeModal}>
        <TouchableOpacity
          className="flex-1 bg-black/60 justify-center items-center px-4"
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            onStartShouldSetResponder={() => true}
            className="bg-white rounded-3xl p-6 w-full max-w-sm relative"
            style={{
              opacity: modalOpacity,
              transform: [{ scale: modalScale }],
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            <TouchableOpacity onPress={closeModal} className="absolute top-3 right-3 z-10">
              <View className="bg-gray-200/80 rounded-full p-1">
                <MaterialIcons name="close" size={20} color="#555" />
              </View>
            </TouchableOpacity>

            <View className="items-center mb-5">
              <View className="w-16 h-16 bg-blue-100 rounded-full justify-center items-center mb-3">
                {renderIcon(selectedIcon, selectedIconType, 28, "#3B82F6")}
              </View>
              <Text className="text-xl font-bold text-gray-800 text-center px-4">
                {selectedButtonLabel || "Información"}
              </Text>
            </View>

            <View className="mb-6">
              {selectedInfo ? (
                selectedInfo.split("\n").map((line, index) => {
                  const trimmedLine = line.trim()
                  if (!trimmedLine) return null

                  if (trimmedLine === "Independencia 1: ⬆️ 5") {
                    return (
                      <View
                        key={index}
                        className="bg-gray-200 rounded-xl p-4 mb-3 border border-gray-300"
                      >
                        <View className="flex-row items-center flex-wrap">
                          <MaterialIcons name="business" size={16} color="#3B82F6" />
                          <Text className="text-gray-800 font-medium ml-2">Independencia 1: </Text>
                          <MaterialIcons name="layers" size={16} color="#4B5563" className="ml-2" />
                          <TouchableOpacity
                            onPress={() => handleNavigateToFloor("Expendedora")}
                            className="ml-1"
                          >
                            <Text className="text-blue-600 font-bold text-base underline">5</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }
                  
                  return line.includes("Café caliente disponible") ? (
                    <View key={index} className="mb-3 px-4">
                      <View className="flex-row items-start">
                        <View className="flex-1">{renderTextWithIcons(line)}</View>
                      </View>
                    </View>
                  ) : (
                    <View
                      key={index}
                      className="bg-gray-200 rounded-xl p-4 mb-3 border border-gray-300"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <View className="flex-row items-start">
                        <View className="mr-3 mt-0.5">
                          <MaterialIcons name="business" size={16} color="#3B82F6" />
                        </View>
                        <View className="flex-1">{renderTextWithIcons(line)}</View>
                      </View>
                    </View>
                  )
                })
              ) : (
                <View className="bg-gray-200 rounded-xl p-4 border border-gray-300">
                  <Text className="text-gray-600 leading-6 text-center font-medium">
                    Selecciona una opción para ver más información.
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              className="bg-blue-600 py-3.5 px-6 rounded-xl"
              onPress={closeModal}
              style={{
                shadowColor: "#3B82F6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text className="text-white text-center font-semibold text-base">Entendido</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

export default Information