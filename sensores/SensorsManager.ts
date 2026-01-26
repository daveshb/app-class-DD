import * as Accelerometer from "expo-accelerometer";
import { Audio } from "expo-av";
import * as Barometer from "expo-barometer";
import * as Camera from "expo-camera";
import * as Gyroscope from "expo-gyroscope";
import * as Magnetometer from "expo-magnetometer";
import * as Speech from "expo-speech";

// Tipos para los datos de sensores
export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

export interface GyroscopeData {
  x: number;
  y: number;
  z: number;
}

export interface MagnetometerData {
  x: number;
  y: number;
  z: number;
}

export interface BarometerData {
  pressure: number;
  relativeAltitude: number;
}

export interface SensorCallback {
  (data: any): void;
}

// Objeto para almacenar las suscripciones activas
const subscriptions = {
  accelerometer: null as any,
  gyroscope: null as any,
  magnetometer: null as any,
  barometer: null as any,
};

// ========================= CÁMARA =========================

/**
 * Solicitar permisos de cámara
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error solicitando permisos de cámara:", error);
    return false;
  }
}

/**
 * Obtener el estado de los permisos de cámara
 */
export async function getCameraPermissionStatus(): Promise<string> {
  try {
    const { status } = await Camera.getCameraPermissionsAsync();
    return status; // 'granted', 'denied', 'undetermined'
  } catch (error) {
    console.error("Error obteniendo permisos de cámara:", error);
    return "denied";
  }
}

/**
 * Tomar una foto con la cámara
 * Nota: Requiere usar expo-camera con CameraView
 */
export async function takePhoto(cameraRef: any): Promise<any> {
  try {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      return photo;
    }
  } catch (error) {
    console.error("Error tomando foto:", error);
    return null;
  }
}

/**
 * Grabar video con la cámara
 */
export async function recordVideo(cameraRef: any): Promise<any> {
  try {
    if (cameraRef) {
      const video = await cameraRef.recordAsync();
      return video;
    }
  } catch (error) {
    console.error("Error grabando video:", error);
    return null;
  }
}

/**
 * Obtener lista de cámaras disponibles
 */
export async function getAvailableCameras(): Promise<any[]> {
  try {
    return await Camera.getAvailableCameraTypesAsync();
  } catch (error) {
    console.error("Error obteniendo cámaras disponibles:", error);
    return [];
  }
}

// ========================= MICRÓFONO =========================

/**
 * Solicitar permisos de micrófono
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error solicitando permisos de micrófono:", error);
    return false;
  }
}

/**
 * Obtener estado de permisos de micrófono
 */
export async function getMicrophonePermissionStatus(): Promise<string> {
  try {
    const { status } = await Audio.getPermissionsAsync();
    return status;
  } catch (error) {
    console.error("Error obteniendo permisos de micrófono:", error);
    return "denied";
  }
}

/**
 * Grabar audio con el micrófono
 */
export async function recordAudio(): Promise<Audio.Recording | null> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    await recording.startAsync();
    return recording;
  } catch (error) {
    console.error("Error iniciando grabación:", error);
    return null;
  }
}

/**
 * Detener grabación de audio
 */
export async function stopRecordingAudio(
  recording: Audio.Recording,
): Promise<string | null> {
  try {
    await recording.stopAndUnloadAsync();
    return recording.getURI();
  } catch (error) {
    console.error("Error deteniendo grabación:", error);
    return null;
  }
}

/**
 * Reproducir audio
 */
export async function playAudio(audioUri: string): Promise<void> {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    await sound.playAsync();
  } catch (error) {
    console.error("Error reproduciendo audio:", error);
  }
}

/**
 * Usar síntesis de voz para hablar
 */
export async function speak(
  text: string,
  language: string = "es-MX",
): Promise<void> {
  try {
    await Speech.speak(text, {
      language: language,
      pitch: 1.0,
      rate: 1.0,
    });
  } catch (error) {
    console.error("Error en síntesis de voz:", error);
  }
}

// ========================= ACELERÓMETRO =========================

/**
 * Obtener datos del acelerómetro una sola vez
 */
export async function getAccelerometerData(): Promise<AccelerometerData | null> {
  try {
    const data = await Accelerometer.getLastKnownOrientationAsync?.();
    return data || null;
  } catch (error) {
    console.error("Error obteniendo datos del acelerómetro:", error);
    return null;
  }
}

/**
 * Escuchar cambios del acelerómetro en tiempo real
 */
export function subscribeToAccelerometer(callback: SensorCallback): void {
  try {
    subscriptions.accelerometer = Accelerometer.addListener(
      (data: AccelerometerData) => {
        callback(data);
      },
    );
  } catch (error) {
    console.error("Error suscribiéndose al acelerómetro:", error);
  }
}

/**
 * Desuscribirse del acelerómetro
 */
export function unsubscribeFromAccelerometer(): void {
  if (subscriptions.accelerometer) {
    subscriptions.accelerometer.remove();
    subscriptions.accelerometer = null;
  }
}

/**
 * Establecer intervalo de actualización del acelerómetro (ms)
 */
export function setAccelerometerUpdateInterval(intervalMs: number): void {
  try {
    Accelerometer.setUpdateInterval(intervalMs);
  } catch (error) {
    console.error("Error estableciendo intervalo:", error);
  }
}

// ========================= GIROSCOPIO =========================

/**
 * Obtener datos del giroscopio una sola vez
 */
export async function getGyroscopeData(): Promise<GyroscopeData | null> {
  try {
    const data = await Gyroscope.getLastKnownOrientationAsync?.();
    return data || null;
  } catch (error) {
    console.error("Error obteniendo datos del giroscopio:", error);
    return null;
  }
}

/**
 * Escuchar cambios del giroscopio en tiempo real
 */
export function subscribeToGyroscope(callback: SensorCallback): void {
  try {
    subscriptions.gyroscope = Gyroscope.addListener((data: GyroscopeData) => {
      callback(data);
    });
  } catch (error) {
    console.error("Error suscribiéndose al giroscopio:", error);
  }
}

/**
 * Desuscribirse del giroscopio
 */
export function unsubscribeFromGyroscope(): void {
  if (subscriptions.gyroscope) {
    subscriptions.gyroscope.remove();
    subscriptions.gyroscope = null;
  }
}

/**
 * Establecer intervalo de actualización del giroscopio (ms)
 */
export function setGyroscopeUpdateInterval(intervalMs: number): void {
  try {
    Gyroscope.setUpdateInterval(intervalMs);
  } catch (error) {
    console.error("Error estableciendo intervalo:", error);
  }
}

// ========================= MAGNETÓMETRO =========================

/**
 * Obtener datos del magnetómetro una sola vez
 */
export async function getMagnetometerData(): Promise<MagnetometerData | null> {
  try {
    const data = await Magnetometer.getLastKnownOrientationAsync?.();
    return data || null;
  } catch (error) {
    console.error("Error obteniendo datos del magnetómetro:", error);
    return null;
  }
}

/**
 * Escuchar cambios del magnetómetro en tiempo real
 */
export function subscribeToMagnetometer(callback: SensorCallback): void {
  try {
    subscriptions.magnetometer = Magnetometer.addListener(
      (data: MagnetometerData) => {
        callback(data);
      },
    );
  } catch (error) {
    console.error("Error suscribiéndose al magnetómetro:", error);
  }
}

/**
 * Desuscribirse del magnetómetro
 */
export function unsubscribeFromMagnetometer(): void {
  if (subscriptions.magnetometer) {
    subscriptions.magnetometer.remove();
    subscriptions.magnetometer = null;
  }
}

// ========================= BARÓMETRO =========================

/**
 * Escuchar cambios del barómetro en tiempo real (presión y altitud)
 */
export function subscribeToBarometer(callback: SensorCallback): void {
  try {
    subscriptions.barometer = Barometer.addListener((data: BarometerData) => {
      callback(data);
    });
  } catch (error) {
    console.error("Error suscribiéndose al barómetro:", error);
  }
}

/**
 * Desuscribirse del barómetro
 */
export function unsubscribeFromBarometer(): void {
  if (subscriptions.barometer) {
    subscriptions.barometer.remove();
    subscriptions.barometer = null;
  }
}

// ========================= SENSOR DE HUELLA (Biometría) =========================

/**
 * Solicitar permisos de biometría
 */
export async function requestBiometricPermission(): Promise<boolean> {
  try {
    // Para iOS y Android, necesitas manejar esto de manera diferente
    // Esta es una simplificación - en producción necesitarías react-native-biometrics
    return true;
  } catch (error) {
    console.error("Error solicitando permisos biométricos:", error);
    return false;
  }
}

/**
 * Verificar disponibilidad de sensores biométricos
 * Nota: Requiere expo-local-authentication o react-native-biometrics
 */
export async function checkBiometricAvailability(): Promise<{
  available: boolean;
  types: string[];
}> {
  try {
    // Esto requeriría una librería adicional como expo-local-authentication
    // Aquí un ejemplo de cómo estructurarlo
    return {
      available: false,
      types: [],
    };
  } catch (error) {
    console.error("Error verificando disponibilidad biométrica:", error);
    return {
      available: false,
      types: [],
    };
  }
}

// ========================= BRÚJULA =========================

/**
 * Obtener datos combinados de acelerómetro, giroscopio y magnetómetro
 * para calcular la dirección de la brújula
 */
export async function getCompassHeading(): Promise<number | null> {
  try {
    // Esto requeriría cálculos más complejos con los datos del magnetómetro
    // Simplificado aquí
    const magnetometerData = await getMagnetometerData();
    if (magnetometerData) {
      const heading =
        Math.atan2(magnetometerData.y, magnetometerData.x) * (180 / Math.PI);
      return heading < 0 ? heading + 360 : heading;
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo dirección de brújula:", error);
    return null;
  }
}

// ========================= GPS / UBICACIÓN =========================

/**
 * Obtener ubicación actual del dispositivo
 * Nota: Requiere expo-location
 */
export async function getDeviceLocation(): Promise<any> {
  try {
    // Requiere: import * as Location from 'expo-location';
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status === 'granted') {
    //   const location = await Location.getCurrentPositionAsync({});
    //   return location;
    // }
    return null;
  } catch (error) {
    console.error("Error obteniendo ubicación:", error);
    return null;
  }
}

// ========================= LIMPIAR TODOS LOS SENSORES =========================

/**
 * Desuscribirse de todos los sensores
 */
export function cleanupAllSensors(): void {
  unsubscribeFromAccelerometer();
  unsubscribeFromGyroscope();
  unsubscribeFromMagnetometer();
  unsubscribeFromBarometer();
}
