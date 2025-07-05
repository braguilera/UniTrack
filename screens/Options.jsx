import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Switch, StyleSheet, Modal, ActivityIndicator, Platform } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // <-- ¡IMPORTA ESTO!

const Options = () => {
  const navigation = useNavigation(); // <-- ¡AÑADE ESTA LÍNEA!
  const [soundGuideEnabled, setSoundGuideEnabled] = useState(false);
  const [collaborativeAnnotationsEnabled, setCollaborativeAnnotationsEnabled] = useState(false);

  // Estados para el Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('confirm'); // 'confirm', 'loading', 'success'

  const handleDownloadMap = () => {
    setModalContent('confirm'); // Establece el contenido inicial del modal a 'confirm'
    setIsModalVisible(true);    // Muestra el modal
  };

  const confirmDownload = async () => {
    setModalContent('loading'); // Muestra un estado de carga mientras "descarga"
    // Aquí simularías la descarga del mapa.
    // En una aplicación real, esto implicaría:
    // 1. Llamar a una función de descarga (por ejemplo, usando expo-file-system o un servicio backend).
    // 2. Manejar la respuesta (éxito o error).
    // Por simplicidad, simularemos un retraso.
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simula una descarga de 2 segundos

    setModalContent('success'); // Cambia el contenido a 'success'
    // El modal se cerrará automáticamente en el onPress del botón "OK" en el estado 'success'
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.optionsContainer}>

        {/* Opción: Tour virtual */}
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => navigation.navigate('Tour Virtual')} // <-- ¡CAMBIA ESTA LÍNEA!
        >
          <MaterialCommunityIcons name="map-marker-path" size={28} color="#4B5563" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Tour virtual</Text>
            <Text style={styles.optionDescription}>Explora la universidad con un tour virtual completo</Text>
          </View>
          <AntDesign name="right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Opción: Mapa sin conexión */}
        <TouchableOpacity style={styles.optionRow} onPress={handleDownloadMap}>
          <MaterialIcons name="wifi-off" size={24} color="black" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Mapa sin conexión</Text>
            <Text style={styles.optionDescription}>Descarga el mapa para usarlo sin internet</Text>
          </View>
          <MaterialIcons name="file-download" size={30} color="#000000" />
        </TouchableOpacity>
        <View style={styles.divider} />

        {/* Opción: Guía con sonido */}
        <View style={styles.optionRow}>
          <Ionicons name="volume-high-outline" size={28} color="#4B5563" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Guía con sonido</Text>
            <Text style={styles.optionDescription}>Activar guía con sonido</Text>
          </View>
          <Switch
            trackColor={{ false: "#E5E7EB", true: "#6B7280" }}
            thumbColor={"#FFFFFF"}
            ios_backgroundColor="#E5E7EB"
            onValueChange={() => setSoundGuideEnabled(previousState => !previousState)}
            value={soundGuideEnabled}
          />
        </View>
        <View style={styles.divider} />

        {/* Opción: Anotaciones colaborativas */}
        <View style={styles.optionRow}>
          <MaterialCommunityIcons name="pencil-box-outline" size={28} color="#4B5563" />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Anotaciones colaborativas</Text>
            <Text style={styles.optionDescription}>Activar anotaciones colaborativas</Text>
          </View>
          <Switch
            trackColor={{ false: "#E5E7EB", true: "#6B7280" }}
            thumbColor={"#FFFFFF"}
            ios_backgroundColor="#E5E7EB"
            onValueChange={() => setCollaborativeAnnotationsEnabled(previousState => !previousState)}
            value={collaborativeAnnotationsEnabled}
          />
        </View>
        <View style={styles.divider} />

      </View>

      {/* --- Modal de Confirmación / Éxito / Carga --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        {/* Usamos un View para el fondo del modal que pueda ser tocado para cerrar */}
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={closeModal} // Cierra el modal si se toca fuera
        >
          {/* Este View interno es para el contenido del modal y para evitar que el toque se propague al fondo */}
          <View style={styles.modalView} onStartShouldSetResponder={() => true}>
            {modalContent === 'confirm' && (
              <>
                <Text style={styles.modalTitle}>Descargar Mapa</Text>
                <Text style={styles.modalText}>¿Estás seguro que deseas descargar el mapa sin conexión?</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonCancel]}
                    onPress={closeModal}
                  >
                    <Text style={styles.textStyle}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonAccept]}
                    onPress={confirmDownload}
                  >
                    <Text style={styles.textStyle}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {modalContent === 'loading' && (
              <View style={styles.loadingContent}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.modalText}>Descargando mapa...</Text>
              </View>
            )}

            {modalContent === 'success' && (
              <>
                <MaterialIcons name="check-circle" size={50} color="green" style={{ marginBottom: 15 }} />
                <Text style={styles.modalTitle}>¡En futuras actualizaciones!</Text>
                <TouchableOpacity
                  style={[styles.button, styles.buttonAccept]}
                  onPress={closeModal}
                >
                  <Text style={styles.textStyle}>OK</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco para el ScrollView
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151', // text-gray-800
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280', // text-gray-600
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth, // Un separador fino
    backgroundColor: '#E5E7EB', // bg-gray-200
    width: '100%',
  },

  // --- Estilos para el Modal ---
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente oscuro
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Ajusta el ancho del modal
    maxWidth: 400, // Máximo ancho para pantallas grandes
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Asegura espacio entre los botones
    width: '100%', // Que ocupe todo el ancho disponible del modal
    marginTop: 10,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12, // Ajusta el padding vertical
    paddingHorizontal: 15, // Ajusta el padding horizontal (para dar más espacio al texto)
    elevation: 2,
    flex: 1, // Permite que el botón se expanda
    marginHorizontal: 5, // Espacio entre botones
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center',   // Centra el contenido horizontalmente
    minHeight: 45, // Añade una altura mínima para asegurar espacio
  },
  buttonCancel: {
    backgroundColor: '#D1D5DB', // gray-300
  },
  buttonAccept: {
    backgroundColor: '#2196F3', // blue-500
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center', // Asegura que el texto esté centrado
    fontSize: 16,        // Mantén este tamaño o ajusta si es necesario
  },
  loadingContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  }
});

export default Options;