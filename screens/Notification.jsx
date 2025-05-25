import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';

const notificationsData = [
  {
    id: 1,
    type: 'concurrencia',
    title: 'Alerta de concurrencia',
    message:
      'Alta concurrencia en la Biblioteca. Se recomienda buscar espacios alternativos en el Edificio Lima 2.',
  },
  {
    id: 2,
    type: 'incidente',
    title: 'Incidente reportado',
    message:
      'Se reportó un corte de luz en el Edificio Central. Personal de mantenimiento está trabajando en ello.',
  },
  {
    id: 3,
    type: 'cambio_salon',
    title: 'Cambio de salón',
    message: 'La clase de Matemática se trasladó al aula 204 del Edificio Lima 1.',
  },
  {
    id: 4,
    type: 'transporte_publico',
    title: 'Transporte público',
    message: 'El colectivo 60 está demorando 15 minutos más de lo habitual.',
  },
  {
    id: 5,
    type: 'zona_favorita',
    title: 'Zona favorita disponible',
    message: 'Tu zona favorita (Aula Magna) tiene asientos disponibles ahora.',
  },
];

function useRotatingNotifications(data, max = 3, interval = 4000) {
  const [start, setStart] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStart((prev) => (prev + 1) % data.length);
    }, interval);
    return () => clearInterval(timer);
  }, [data.length, interval]);

  const notifications = [];
  for (let i = 0; i < Math.min(max, data.length); i++) {
    notifications.push(data[(start + i) % data.length]);
  }
  return notifications;
}

const AnimatedNotification = ({ title, message, id }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, id]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
      className="border-b border-gray-300 pb-4 mb-4"
    >
      <Text className="text-lg font-semibold mb-1 text-gray-800">
        {title}
      </Text>
      <Text className="text-base text-gray-700">
        {message}
      </Text>
    </Animated.View>
  );
};

const Notification = () => {
  const notifications = useRotatingNotifications(notificationsData, 3, 4000);

  return (
    <ScrollView className="flex-1">
      <View className="px-5 pt-16">
        <Text className="text-4xl font-bold mb-5">Notification</Text>
        <View className="h-px bg-gray-300 my-4 w-full" />
      </View>
      <View className="flex-1 bg-white p-5">
        {notifications.map((notif) => (
          <AnimatedNotification
            key={notif.id}
            id={notif.id}
            title={notif.title}
            message={notif.message}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default Notification;
