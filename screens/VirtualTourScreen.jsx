import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Modal, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const tourVideos = [
  { id: '1', title: 'Historia de la UADE', description: 'Un recorrido por los orígenes de la universidad.', thumbnail: require('../assets/images/Tour/HistoriaDeUade.png') },
  { id: '2', title: 'Buffet Central', description: 'Conoce el lugar donde recargar energías.', thumbnail: require('../assets/images/Tour/BuffetCentral.png') },
  { id: '3', title: 'Otto, el gato del campus', description: 'La mascota más querida de la universidad.', thumbnail: require('../assets/images/Tour/OttoUade.png') },
  { id: '4', title: 'Oficina de Alumnos', description: 'Trámites y consultas académicas.', thumbnail: require('../assets/images/Tour/OficinaAlumnos.png') },
  { id: '5', title: 'Biblioteca Central', description: 'Descubre el vasto conocimiento a tu disposición.', thumbnail: require('../assets/images/Tour/BibliotecaCentral.png') },
  { id: '6', title: 'Aulas y Laboratorios', description: 'Un vistazo a los espacios de aprendizaje.', thumbnail: require('../assets/images/Tour/Laboratorios.png') },
  // Puedes añadir más videos aquí
];

const VirtualTourScreen = () => {
  const navigation = useNavigation();
  
  // Estados para el Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('confirm');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoPress = (video) => {
    setSelectedVideo(video);
    setModalContent('confirm');
    setIsModalVisible(true);
  };

  const confirmPlayVideo = async () => {
    setModalContent('loading');
    // Simula la carga del video
    await new Promise(resolve => setTimeout(resolve, 2000));
    setModalContent('success');
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedVideo(null);
  };

  // Función de retroceso corregida
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback corregido - navegar al stack correcto
      navigation.navigate('Options');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tour Virtual</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridContainer}>
        {tourVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handleVideoPress(video)}
          >
            <ImageBackground source={video.thumbnail} style={styles.thumbnail}>
              <MaterialIcons name="play-circle-outline" size={50} color="rgba(255,255,255,0.8)" />
            </ImageBackground>
            <Text style={styles.videoTitle} numberOfLines={2}>{video.title}</Text>
            <Text style={styles.videoDescription} numberOfLines={2}>{video.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- Modal de Confirmación / Carga / Éxito --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
          onPressOut={closeModal}
        >
          <View style={styles.modalView} onStartShouldSetResponder={() => true}>
            {modalContent === 'confirm' && selectedVideo && (
              <>
                <MaterialIcons name="play-circle-outline" size={50} color="#2196F3" style={{ marginBottom: 15 }} />
                <Text style={styles.modalTitle}>Reproducir Video</Text>
                <Text style={styles.modalText}>
                  ¿Deseas reproducir "{selectedVideo.title}"?
                </Text>
                <Text style={styles.modalDescription}>
                  {selectedVideo.description}
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonCancel]}
                    onPress={closeModal}
                  >
                    <Text style={styles.textStyle}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonAccept]}
                    onPress={confirmPlayVideo}
                  >
                    <Text style={styles.textStyle}>Reproducir</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {modalContent === 'loading' && (
              <View style={styles.loadingContent}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.modalText}>Cargando video...</Text>
              </View>
            )}

            {modalContent === 'success' && selectedVideo && (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 40, // Margen superior fijo para simular el espacio de la barra de estado
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: -40, // Compensa el espacio del botón de retroceso para centrar el título
    color: '#374151',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  videoCard: {
    width: '45%',
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  thumbnail: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingTop: 8,
    minHeight: 45,
  },
  videoDescription: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 8,
    minHeight: 35,
  },

  // --- Estilos para el Modal (copiados de Options.js) ---
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
  modalDescription: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
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
    fontSize: 14.5,        // Mantén este tamaño o ajusta si es necesario
  },
  loadingContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  }
});

export default VirtualTourScreen;