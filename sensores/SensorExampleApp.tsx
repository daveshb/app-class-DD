import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera';
import SensorsManager from './SensorsManager';

/**
 * Componente de Ejemplo Completo de Sensores - app-class
 * 
 * Muestra el uso de todos los sensores disponibles:
 * - Acelerómetro, Giroscopio, Magnetómetro, Barómetro
 * - Cámara, Micrófono, Síntesis de Voz
 * 
 * Compatible con expo-router y la estructura de app-class
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CameraView } from 'expo-camera';
import SensorsManager from './SensorsManager';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

  // Estados para cada sensor
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [barometerData, setBarometerData] = useState({
    pressure: 0,
    relativeAltitude: 0,
  });
  const [compassHeading, setCompassHeading] = useState(0);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [microphonePermission, setMicrophonePermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);

  // Inicializar permisos y sensores
  useEffect(() => {
    initializeSensors();
    return () => {
      sensorsManager.cleanupAllSensors();
    };
  }, []);

  /**
   * Inicializar todos los sensores
   */
  const initializeSensors = async () => {
    // Solicitar permisos
    const cameraOk = await sensorsManager.requestCameraPermission();
    setCameraPermission(cameraOk);

    const microphoneOk = await sensorsManager.requestMicrophonePermission();
    setMicrophonePermission(microphoneOk);

    // Suscribirse a sensores de movimiento
    sensorsManager.subscribeToAccelerometer((data) => {
      setAccelerometerData(data);
    });

    sensorsManager.subscribeToGyroscope((data) => {
      setGyroscopeData(data);
    });

    sensorsManager.subscribeToMagnetometer((data) => {
      setMagnetometerData(data);
      // Calcular brújula
      const heading =
        Math.atan2(data.y, data.x) * (180 / Math.PI);
      setCompassHeading(heading < 0 ? heading + 360 : heading);
    });

    sensorsManager.subscribeToBarometer((data) => {
      setBarometerData(data);
    });

    // Establecer intervalos de actualización (en ms)
    sensorsManager.setAccelerometerUpdateInterval(100);
    sensorsManager.setGyroscopeUpdateInterval(100);
  };

  /**
   * Manejar grabación de audio
   */
  const handleRecordAudio = async () => {
    if (!isRecording) {
      const recording = await sensorsManager.recordAudio();
      if (recording) {
        recordingRef.current = recording;
        setIsRecording(true);
      }
    } else {
      if (recordingRef.current) {
        const uri = await sensorsManager.stopRecordingAudio(
          recordingRef.current
        );
        setIsRecording(false);
        if (uri) {
          console.log('Audio grabado en:', uri);
          // Aquí podrías reproducir o enviar el audio
        }
      }
    }
  };

  /**
   * Tomar foto
   */
  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const photo = await sensorsManager.takePhoto(cameraRef.current);
      if (photo) {
        console.log('Foto tomada:', photo.uri);
      }
    }
  };

  /**
   * Realizar síntesis de voz
   */
  const handleSpeak = async () => {
    await sensorsManager.speak(
      'Hola, estoy usando los sensores del teléfono con React Native'
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* TÍTULO */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestor de Sensores</Text>
        <Text style={styles.subtitle}>React Native + Expo</Text>
      </View>

      {/* ACELERÓMETRO */}
      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>📱 Acelerómetro</Text>
        <Text style={styles.sensorData}>
          X: {accelerometerData.x.toFixed(2)} m/s²
        </Text>
        <Text style={styles.sensorData}>
          Y: {accelerometerData.y.toFixed(2)} m/s²
        </Text>
        <Text style={styles.sensorData}>
          Z: {accelerometerData.z.toFixed(2)} m/s²
        </Text>
        <Text style={styles.description}>
          Mide la aceleración del dispositivo en los tres ejes
        </Text>
      </View>

      {/* GIROSCOPIO */}
      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>🔄 Giroscopio</Text>
        <Text style={styles.sensorData}>
          X: {gyroscopeData.x.toFixed(2)} rad/s
        </Text>
        <Text style={styles.sensorData}>
          Y: {gyroscopeData.y.toFixed(2)} rad/s
        </Text>
        <Text style={styles.sensorData}>
          Z: {gyroscopeData.z.toFixed(2)} rad/s
        </Text>
        <Text style={styles.description}>
          Mide la velocidad angular de rotación
        </Text>
      </View>

      {/* MAGNETÓMETRO */}
      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>🧭 Magnetómetro</Text>
        <Text style={styles.sensorData}>
          X: {magnetometerData.x.toFixed(2)} µT
        </Text>
        <Text style={styles.sensorData}>
          Y: {magnetometerData.y.toFixed(2)} µT
        </Text>
        <Text style={styles.sensorData}>
          Z: {magnetometerData.z.toFixed(2)} µT
        </Text>
        <Text style={styles.description}>
          Mide el campo magnético terrestre
        </Text>
      </View>

      {/* BRÚJULA */}
      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>🧭 Brújula</Text>
        <Text style={styles.sensorData}>
          Dirección: {compassHeading.toFixed(1)}°
        </Text>
        <Text style={styles.description}>
          {getCompassDirection(compassHeading)}
        </Text>
      </View>

      {/* BARÓMETRO */}
      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>🌡️ Barómetro</Text>
        <Text style={styles.sensorData}>
          Presión: {barometerData.pressure.toFixed(2)} hPa
        </Text>
        <Text style={styles.sensorData}>
          Altitud relativa: {barometerData.relativeAltitude.toFixed(2)} m
        </Text>
        <Text style={styles.description}>
          Mide la presión atmosférica
        </Text>
      </View>

      {/* CÁMARA */}
      {cameraPermission && (
        <View style={styles.sensorCard}>
          <Text style={styles.sensorTitle}>📷 Cámara</Text>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleTakePhoto}
          >
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MICRÓFONO */}
      {microphonePermission && (
        <View style={styles.sensorCard}>
          <Text style={styles.sensorTitle}>🎤 Micrófono</Text>
          <TouchableOpacity
            style={[
              styles.button,
              isRecording && styles.buttonActive,
            ]}
            onPress={handleRecordAudio}
          >
            <Text style={styles.buttonText}>
              {isRecording ? 'Detener Grabación' : 'Grabar Audio'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SÍNTESIS DE VOZ */}
      <View style={styles.sensorCard}>
        <Text style={styles.sensorTitle}>🔊 Síntesis de Voz</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSpeak}
        >
          <Text style={styles.buttonText}>Hablar</Text>
        </TouchableOpacity>
      </View>

      {/* INFORMACIÓN */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Información</Text>
        <Text style={styles.infoText}>
          • Acelerómetro: Detecta movimiento y orientación{'\n'}
          • Giroscopio: Mide rotación del dispositivo{'\n'}
          • Magnetómetro: Brújula digital{'\n'}
          • Barómetro: Presión atmosférica y altitud{'\n'}
          • Cámara: Captura fotos y videos{'\n'}
          • Micrófono: Graba audio{'\n'}
          • Síntesis de voz: Reproducción de texto
        </Text>
      </View>
    </ScrollView>
  );
}

/**
 * Obtener dirección cardinal basado en grados
 */
function getCompassDirection(degrees: number): string {
  const directions = ['Norte', 'NE', 'Este', 'SE', 'Sur', 'SO', 'Oeste', 'NO'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  sensorCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sensorData: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'Menlo',
  },
  description: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  camera: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#0D47A1',
    lineHeight: 20,
  },
});
