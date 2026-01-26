# Sensores de Dispositivos Móviles con React Native + Expo

# Sensores de Dispositivos Móviles con Expo + app-class

Guía completa para acceder y utilizar todos los sensores disponibles en un celular usando Expo en el proyecto **app-class**.

## 📋 Tabla de Contenidos

1. [Instalación](#instalación)
2. [Sensores Disponibles](#sensores-disponibles)
3. [Clase SensorsManager](#clase-sensorsmanager)
4. [Ejemplos de Uso](#ejemplos-de-uso)
5. [Permisos Requeridos](#permisos-requeridos)
6. [Casos de Uso](#casos-de-uso)

---

## 🚀 Instalación

### 1. Dependencias del Proyecto

El proyecto **app-class** ya tiene instaladas las dependencias necesarias:

```bash
npm install expo-sensors expo-camera expo-av expo-speech
```

### 2. Verificar Instalación

```bash
# Ver versiones instaladas
npm list | grep -E "expo-sensors|expo-camera|expo-av|expo-speech"
```

### 3. Estructura del Proyecto

```
app-class/
├── sensores/
│   ├── SensorsManager.ts       # Clase principal de gestión
│   ├── SensorExampleApp.tsx    # Ejemplo completo
│   ├── useSensorHooks.ts       # Custom hooks
│   └── sensores.md             # Este archivo
├── app/
│   ├── (app)/
│   ├── (tabs)/
│   ├── (auth)/
│   └── _layout.tsx
├── services/
├── package.json
└── app.json
```

---

## 📱 Sensores Disponibles

### 1. **Acelerómetro** 📱

Mide la aceleración lineal en los tres ejes (X, Y, Z)

**Casos de uso en app-class:**

- Detectar caídas del dispositivo (para usuarios mayores)
- Reconocer gestos de sacudida para acciones rápidas
- Monitoreo de actividad física del usuario
- Juegos o aplicaciones interactivas

**Datos retornados:**

```typescript
interface AccelerometerData {
  x: number; // m/s² (eje X)
  y: number; // m/s² (eje Y)
  z: number; // m/s² (eje Z)
}
```

**Ejemplo:**

```typescript
import { useStepCounter } from '@/sensores/useSensorHooks';

export default function ActivityTracker() {
  const steps = useStepCounter();
  return <Text>Pasos detectados: {steps}</Text>;
}
```

---

### 2. **Giroscopio** 🔄

Mide la velocidad angular de rotación en los tres ejes

**Casos de uso en app-class:**

- Detección de orientación del dispositivo
- Control de rotación de cámara
- Realidad aumentada (AR)
- Estabilización de video

**Datos retornados:**

```typescript
interface GyroscopeData {
  x: number; // radianes/segundo
  y: number; // radianes/segundo
  z: number; // radianes/segundo
}
```

---

### 3. **Magnetómetro** 🧭

Mide el campo magnético terrestre

**Casos de uso en app-class:**

- Crear una brújula digital para navegación
- Determinar dirección cardinal
- Mapas e indicaciones
- Realidad aumentada con orientación

**Datos retornados:**

```typescript
interface MagnetometerData {
  x: number; // microtesla (µT)
  y: number; // microtesla (µT)
  z: number; // microtesla (µT)
}
```

**Ejemplo - Brújula:**

```typescript
import { useCompass } from '@/sensores/useSensorHooks';

export default function Compass() {
  const { heading, direction } = useCompass();

  return (
    <Text>
      {direction} ({heading.toFixed(0)}°)
    </Text>
  );
}
```

---

### 4. **Barómetro** 🌡️

Mide la presión atmosférica para calcular altitud

**Casos de uso en app-class:**

- Calcular altitud relativa
- Predicción del clima
- Actividades outdoor (senderismo, etc)
- Monitoreo ambiental

**Datos retornados:**

```typescript
interface BarometerData {
  pressure: number; // hectopascales (hPa)
  relativeAltitude: number; // metros (m)
}
```

---

### 5. **Cámara** 📷

Captura fotos y videos

**Casos de uso en app-class:**

- Tomar fotos de perfil
- Identificación con foto
- Documentación de incidentes
- Videollamadas

---

### 6. **Micrófono** 🎤

Graba audio

**Casos de uso en app-class:**

- Grabación de notas de voz
- Llamadas de emergencia
- Transcripción de audio
- Verificación de voz

---

### 7. **Síntesis de Voz** 🔊

Reproduce texto como audio

**Casos de uso en app-class:**

- Notificaciones de audio
- Accesibilidad para usuarios con visión reducida
- Instrucciones por voz
- Alertas de emergencia

**Ejemplo:**

```typescript
import SensorsManager from "@/sensores/SensorsManager";

const sensorsManager = new SensorsManager();
await sensorsManager.speak("Hola usuario", "es-MX");
```

---

## 🔧 Clase SensorsManager

### Métodos Principales

#### Acelerómetro

```typescript
// Suscribirse a datos del acelerómetro
sensorsManager.subscribeToAccelerometer((data) => {
  console.log(`X: ${data.x}, Y: ${data.y}, Z: ${data.z}`);
});

// Desuscribirse
sensorsManager.unsubscribeFromAccelerometer();

// Configurar intervalo de actualización (en ms)
sensorsManager.setAccelerometerUpdateInterval(100);
```

#### Giroscopio

```typescript
sensorsManager.subscribeToGyroscope((data) => {
  console.log("Rotación:", data);
});

sensorsManager.unsubscribeFromGyroscope();
sensorsManager.setGyroscopeUpdateInterval(100);
```

#### Magnetómetro

```typescript
sensorsManager.subscribeToMagnetometer((data) => {
  console.log("Campo magnético:", data);
});

sensorsManager.unsubscribeFromMagnetometer();
```

#### Barómetro

```typescript
sensorsManager.subscribeToBarometer((data) => {
  console.log(`Presión: ${data.pressure} hPa`);
  console.log(`Altitud: ${data.relativeAltitude} m`);
});

sensorsManager.unsubscribeFromBarometer();
```

#### Cámara

```typescript
// Solicitar permiso
const hasCameraAccess = await sensorsManager.requestCameraPermission();

// Tomar foto
const photo = await sensorsManager.takePhoto(cameraRef);
```

#### Micrófono

```typescript
// Solicitar permiso
const hasMicrophoneAccess = await sensorsManager.requestMicrophonePermission();

// Grabar audio
const recording = await sensorsManager.recordAudio();

// Detener grabación
const audioUri = await sensorsManager.stopRecordingAudio(recording);

// Reproducir audio
await sensorsManager.playAudio(audioUri);
```

#### Síntesis de Voz

```typescript
// Hablar (español de México)
await sensorsManager.speak("Hola, este es un mensaje de prueba", "es-MX");
```

#### Limpieza

```typescript
// Detener todos los sensores y liberar recursos
sensorsManager.cleanupAllSensors();
```

---

## 📚 Ejemplos de Uso

### Ejemplo 1: Detector de Caídas (Seguridad)

```typescript
// app/(app)/safety/fall-detection.tsx
import { useShakeDetection } from '@/sensores/useSensorHooks';
import { View, Text, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function FallDetectionScreen() {
  useShakeDetection(() => {
    Alert.alert(
      'Caída Detectada',
      '¿Necesitas ayuda?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí, llamar al 911', onPress: () => {/* llamar */} },
      ]
    );
  });

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <ThemedText type="title">Detector de Caídas</ThemedText>
      <ThemedText>Activo y monitoreando...</ThemedText>
    </View>
  );
}
```

### Ejemplo 2: Brújula Integrada

```typescript
// Agregar a app/(tabs)/_layout.tsx
import CompassScreen from './compass';

export default function TabsLayout() {
  return (
    <BottomTabNavigator
      screenOptions={{/* ... */}}
    >
      <Tab.Screen name="compass" component={CompassScreen} />
    </BottomTabNavigator>
  );
}
```

### Ejemplo 3: Grabador de Notas de Voz

```typescript
// app/(app)/notes/voice-recorder.tsx
import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import SensorsManager from '@/sensores/SensorsManager';

export default function VoiceRecorderScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const sensorsManager = new SensorsManager();

  const startRecording = async () => {
    const result = await sensorsManager.recordAudio();
    if (result) {
      setIsRecording(true);
    }
  };

  return (
    <View>
      <Button
        title={isRecording ? 'Detener' : 'Grabar'}
        onPress={isRecording ? () => {} : startRecording}
      />
    </View>
  );
}
```

---

## ✅ Permisos Requeridos

### iOS (app.json)

```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "Necesitamos acceso a la cámara",
      "NSMicrophoneUsageDescription": "Necesitamos acceso al micrófono"
    }
  }
}
```

### Android (app.json)

```json
{
  "android": {
    "permissions": [
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO"
    ]
  }
}
```

---

## 💡 Tips y Buenas Prácticas

### 1. Optimizar Consumo de Batería

```typescript
// Aumentar intervalo para datos menos frecuentes
sensorsManager.setAccelerometerUpdateInterval(500); // Cada 500ms

// Desuscribirse cuando no se necesite
useEffect(() => {
  sensorsManager.subscribeToAccelerometer(callback);

  return () => {
    sensorsManager.unsubscribeFromAccelerometer();
  };
}, []);
```

### 2. Filtrar Datos Ruidosos

```typescript
const [smoothedData, setSmoothedData] = useState(initialData);

const applyLowPassFilter = (prev, current) => {
  const alpha = 0.7; // Factor de suavizado
  return {
    x: prev.x * alpha + current.x * (1 - alpha),
    y: prev.y * alpha + current.y * (1 - alpha),
    z: prev.z * alpha + current.z * (1 - alpha),
  };
};
```

### 3. Debugging

```typescript
sensorsManager.subscribeToAccelerometer((data) => {
  console.log("Acelerómetro:", JSON.stringify(data, null, 2));
});
```

---

## 🐛 Troubleshooting

| Problema                        | Solución                                                                    |
| ------------------------------- | --------------------------------------------------------------------------- |
| Los sensores no devuelven datos | Verifica que el dispositivo tenga el sensor (ej: no todos tienen barómetro) |
| Permisos denegados              | Revisa `app.json` y solicita permisos en tiempo de ejecución                |
| La app se cierra con cámara     | Verifica `expo-camera` instalado y permisos configurados                    |
| Datos ruidosos del acelerómetro | Aplica un filtro pasa-bajos (low-pass filter)                               |
| Bajo rendimiento                | Aumenta el intervalo de actualización de sensores                           |

---

## 📞 Referencias

- [Documentación Expo Sensors](https://docs.expo.dev/versions/latest/sdk/sensors/)
- [Documentación Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Documentación Expo Audio](https://docs.expo.dev/versions/latest/sdk/audio/)
- [Documentación Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/)
- [INSTALACION.md](./INSTALACION.md) - Guía paso a paso

---

**Proyecto:** app-class  
**Actualizado:** Enero 2026  
**Tecnologías:** Expo 54.0.30, React Native 0.81.5, TypeScript

---

### 5. **Cámara** 📷

Acceso a la cámara frontal y trasera

**Casos de uso:**

- Tomar fotos
- Grabar videos
- Escanear códigos QR
- Realidad aumentada

---

### 6. **Micrófono** 🎤

Grabar audio del micrófono

**Casos de uso:**

- Grabar audio/notas de voz
- Llamadas de voz
- Reconocimiento de voz
- Análisis de audio

---

### 7. **Síntesis de Voz** 🔊

Convertir texto a voz

**Casos de uso:**

- Lectura de contenido
- Accesibilidad
- Notificaciones de voz
- Guías interactivas

---

### 8. **Sensor de Huella Dactilar** 👆

Autenticación biométrica (requiere librería adicional)

**Casos de uso:**

- Autenticación segura
- Desbloqueo de apps
- Confirmación de transacciones

**Nota:** Requiere `expo-local-authentication` o `react-native-biometrics`

---

### 9. **GPS/Ubicación** 📍

Ubicación del dispositivo (requiere expo-location)

**Casos de uso:**

- Aplicaciones de mapas
- Rastreo de ubicación
- Geofencing
- Servicios basados en ubicación

```bash
expo install expo-location
```

---

## 🛠️ Clase SensorsManager

### Descripción

Clase singleton que gestiona acceso a todos los sensores de forma centralizada.

### Métodos Principales

#### Cámara

```typescript
// Solicitar permiso
await sensorsManager.requestCameraPermission(): Promise<boolean>

// Obtener estado del permiso
await sensorsManager.getCameraPermissionStatus(): Promise<string>

// Tomar foto
await sensorsManager.takePhoto(cameraRef): Promise<any>

// Grabar video
await sensorsManager.recordVideo(cameraRef): Promise<any>
```

#### Micrófono

```typescript
// Solicitar permiso
await sensorsManager.requestMicrophonePermission(): Promise<boolean>

// Grabar audio
const recording = await sensorsManager.recordAudio(): Promise<Audio.Recording>

// Detener grabación
await sensorsManager.stopRecordingAudio(recording): Promise<string>

// Reproducir audio
await sensorsManager.playAudio(uri): Promise<void>

// Hablar (síntesis de voz)
await sensorsManager.speak(text, language): Promise<void>
```

#### Acelerómetro

```typescript
// Obtener datos una vez
await sensorsManager.getAccelerometerData(): Promise<AccelerometerData>

// Suscribirse a cambios
sensorsManager.subscribeToAccelerometer((data) => {
  console.log(data.x, data.y, data.z);
});

// Desuscribirse
sensorsManager.unsubscribeFromAccelerometer(): void

// Establecer frecuencia de actualización (ms)
sensorsManager.setAccelerometerUpdateInterval(100): void
```

#### Giroscopio

```typescript
// Suscribirse a cambios
sensorsManager.subscribeToGyroscope((data) => {
  console.log(data.x, data.y, data.z); // rad/s
});

// Desuscribirse
sensorsManager.unsubscribeFromGyroscope(): void
```

#### Magnetómetro

```typescript
// Suscribirse a cambios
sensorsManager.subscribeToMagnetometer((data) => {
  console.log(data.x, data.y, data.z); // µT
});

// Desuscribirse
sensorsManager.unsubscribeFromMagnetometer(): void
```

#### Barómetro

```typescript
// Suscribirse a cambios
sensorsManager.subscribeToBarometer((data) => {
  console.log(data.pressure, data.relativeAltitude);
});

// Desuscribirse
sensorsManager.unsubscribeFromBarometer(): void
```

#### Brújula

```typescript
// Obtener dirección en grados
const heading = await sensorsManager.getCompassHeading(): Promise<number>
// Retorna: 0-360 grados (0=Norte, 90=Este, 180=Sur, 270=Oeste)
```

#### Limpieza

```typescript
// Desuscribirse de todos los sensores
sensorsManager.cleanupAllSensors(): void
```

---

## 💻 Ejemplos de Uso

### 1. Acelerómetro - Detectar Sacudidas

```typescript
import SensorsManager from "./SensorsManager";

const sensorsManager = new SensorsManager();
let lastShakeTime = 0;

sensorsManager.subscribeToAccelerometer((data) => {
  const acceleration = Math.sqrt(
    Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2),
  );

  // Detectar si hay mucha aceleración
  if (acceleration > 25) {
    const now = Date.now();
    if (now - lastShakeTime > 500) {
      console.log("¡Sacudida detectada!");
      lastShakeTime = now;
    }
  }
});

// Limpiar cuando termines
sensorsManager.unsubscribeFromAccelerometer();
```

### 2. Giroscopio - Rotación del Dispositivo

```typescript
sensorsManager.subscribeToGyroscope((data) => {
  // Detectar si el dispositivo está girando rápidamente
  const rotationSpeed = Math.sqrt(
    Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2),
  );

  if (rotationSpeed > 2) {
    console.log("Girando rápidamente:", rotationSpeed);
  }
});
```

### 3. Brújula - Obtener Dirección

```typescript
const heading = await sensorsManager.getCompassHeading();
console.log(`Dirección: ${heading.toFixed(1)}°`);

// Determinar dirección cardinal
function getDirection(degrees) {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

console.log(`Dirección cardinal: ${getDirection(heading)}`);
```

### 4. Cámara - Tomar Foto

```typescript
import { CameraView } from 'expo-camera';

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const sensorsManager = useRef(new SensorsManager()).current;

  const takePicture = async () => {
    const photo = await sensorsManager.takePhoto(cameraRef.current);
    if (photo) {
      console.log('Foto guardada en:', photo.uri);
      // Puedes enviar la foto, guardarla, etc.
    }
  };

  return (
    <View>
      <CameraView ref={cameraRef} style={{ height: 400 }} />
      <Button title="Tomar Foto" onPress={takePicture} />
    </View>
  );
}
```

### 5. Micrófono - Grabar Audio

```typescript
const [isRecording, setIsRecording] = useState(false);
const recordingRef = useRef(null);

const startRecording = async () => {
  const recording = await sensorsManager.recordAudio();
  recordingRef.current = recording;
  setIsRecording(true);
};

const stopRecording = async () => {
  const uri = await sensorsManager.stopRecordingAudio(recordingRef.current);
  setIsRecording(false);
  console.log("Audio guardado en:", uri);
};
```

### 6. Síntesis de Voz

```typescript
const speakText = async () => {
  await sensorsManager.speak(
    "Hola, soy una aplicación que usa los sensores del teléfono",
    "es-MX", // Idioma: español mexicano
  );
};
```

### 7. Barómetro - Calcular Altitud

```typescript
sensorsManager.subscribeToBarometer((data) => {
  console.log(`
    Presión: ${data.pressure} hPa
    Altitud relativa: ${data.relativeAltitude} m
  `);
});
```

### 8. Combinar Sensores - Orientación 3D

```typescript
const [orientation, setOrientation] = useState({
  pitch: 0,
  roll: 0,
  yaw: 0,
});

sensorsManager.subscribeToAccelerometer((accel) => {
  // Pitch (inclinación hacia adelante/atrás)
  const pitch = Math.atan2(accel.y, accel.z) * (180 / Math.PI);

  setOrientation((prev) => ({
    ...prev,
    pitch,
  }));
});

sensorsManager.subscribeToGyroscope((gyro) => {
  // Roll (inclinación izquierda/derecha)
  const roll = gyro.x * (180 / Math.PI);

  setOrientation((prev) => ({
    ...prev,
    roll,
  }));
});
```

---

## 🔐 Permisos Requeridos

### iOS (Info.plist)

```xml
<key>NSCameraUsageDescription</key>
<string>Se necesita acceso a la cámara</string>

<key>NSMicrophoneUsageDescription</key>
<string>Se necesita acceso al micrófono</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Se necesita acceso a la ubicación</string>

<key>NSFaceIDUsageDescription</key>
<string>Se necesita acceso a Face ID</string>
```

### Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

---

## Casos de Uso

### 1. Aplicación de Fitness

- Usar acelerómetro y giroscopio para contar pasos
- Medir calorías quemadas
- Detectar tipo de ejercicio

### 2. Aplicación de Mapas

- GPS para ubicación
- Brújula para orientación
- Cámara para realidad aumentada

### 3. Juego Interactivo

- Acelerómetro para controlar movimiento
- Giroscopio para rotación de cámara
- Cámara para capturar personajes

### 4. Asistente de Voz

- Micrófono para capturar audio
- Síntesis de voz para respuestas
- Reconocimiento de voz

### 5. Aplicación Meteorológica

- Barómetro para presión y altitud
- Ubicación para datos locales
- Predicción del clima

### 6. Seguridad Biométrica

- Sensor de huella para autenticación
- Face ID para desbloqueo
- Encriptación de datos

---

## Consideraciones Importantes

1. **Permisos**: Siempre solicitar permisos antes de usar sensores
2. **Privacidad**: Informar al usuario qué sensores estás usando
3. **Batería**: Algunos sensores consumen mucha batería
4. **Limpieza**: Siempre desuscribirse de sensores cuando termines
5. **Compatibilidad**: No todos los dispositivos tienen todos los sensores
6. **Frecuencia**: Establecer intervalos apropiados para actualización

---

## Referencias Útiles

- [Expo Sensors](https://docs.expo.dev/versions/latest/sdk/sensors/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo Audio](https://docs.expo.dev/versions/latest/sdk/av/)
- [Expo Speech](https://docs.expo.dev/versions/latest/sdk/speech/)
- [React Native Docs](https://reactnative.dev/)

---

## Contribuciones

Para mejorar esta guía o agregar más ejemplos, siéntete libre de contribuir.

**Última actualización:** Enero 2026
