# Guía de Instalación y Configuración - app-class

## Pasos para usar los Sensores en el proyecto app-class

### 1. Verificar Dependencias Instaladas

Las dependencias ya están instaladas en el proyecto. Verifica en `package.json`:

```json
{
  "dependencies": {
    "expo-av": "~15.0.10",
    "expo-camera": "~16.0.11",
    "expo-sensors": "~14.0.5",
    "expo-speech": "~14.0.9"
  }
}
```

Si falta alguna, instálala:

```bash
npm install expo-sensors expo-camera expo-av expo-speech
```

### 2. Archivos del Proyecto

Los archivos de sensores están en:

```
app-class/
├── sensores/
│   ├── SensorsManager.ts           # Clase principal ⭐
│   ├── SensorExampleApp.tsx        # Ejemplo completo
│   ├── useSensorHooks.ts           # Hooks reutilizables
│   └── sensores.md                 # Documentación
├── app/
│   ├── (tabs)/
│   ├── (app)/
│   └── (auth)/
└── package.json
```

### 3. Configuración en app.json (Ya Configurado)

El archivo `app.json` ya está configurado con los permisos necesarios:

```json
{
  "expo": {
    "name": "app-class",
    "slug": "app-class",
    "version": "1.0.0",
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Necesitamos acceso a la cámara",
        "NSMicrophoneUsageDescription": "Necesitamos acceso al micrófono"
      }
    },
    "android": {
      "package": "com.appclass",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO"
      ]
    }
  }
}
```

### 4. Uso en el Proyecto app-class

#### Opción A: Crear Página de Sensores

Crea un archivo en la ruta `app/(app)/sensors.tsx`:

```typescript
// app/(app)/sensors.tsx
import SensorExampleApp from '@/sensores/SensorExampleApp';

export default function SensorsPage() {
  return <SensorExampleApp />;
}
```

Luego agrega la ruta en `app/(app)/_layout.tsx`:

```typescript
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="sensors"
        options={{ title: 'Sensores Disponibles' }}
      />
      {/* otras rutas */}
    </Stack>
  );
}
```

#### Opción B: Usar Hooks en Componentes

```typescript
// app/(app)/index.tsx
import { useCompass, useStepCounter, useShakeDetection } from '@/sensores/useSensorHooks';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  const { heading, direction } = useCompass();
  const steps = useStepCounter();

  useShakeDetection(() => {
    alert('Dispositivo sacudido');
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dirección: {direction} ({heading.toFixed(0)}°)</Text>
      <Text>Pasos: {steps}</Text>
    </View>
  );
}
```

#### Opción C: Usar en Servicios

```typescript
// services/sensorsService.ts
import SensorsManager from "@/sensores/SensorsManager";

class SensorsService {
  private sensorsManager = new SensorsManager();

  async getMicrophonePermission() {
    return await this.sensorsManager.requestMicrophonePermission();
  }

  subscribeToAccelerometer(callback: Function) {
    return this.sensorsManager.subscribeToAccelerometer(callback);
  }

  // ... más métodos
}

export default new SensorsService();
```

### 5. Ejecutar la App

```bash
# Desde la carpeta raíz
npm start

# O directamente en Android:
npm run android

# O en iOS:
npm run ios
```

---

## 📋 Tabla de Referencia Rápida

| Sensor          | Hook             | Método Directo               | Permisos            |
| --------------- | ---------------- | ---------------------------- | ------------------- |
| Acelerómetro    | `useStepCounter` | `subscribeToAccelerometer()` | ❌ No               |
| Giroscopio      | -                | `subscribeToGyroscope()`     | ❌ No               |
| Magnetómetro    | `useCompass`     | `subscribeToMagnetometer()`  | ❌ No               |
| Barómetro       | -                | `subscribeToBarometer()`     | ❌ No               |
| Cámara          | -                | `takePhoto()`                | ✅ Sí (iOS/Android) |
| Micrófono       | -                | `recordAudio()`              | ✅ Sí (iOS/Android) |
| Síntesis de Voz | -                | `speak()`                    | ❌ No               |

---

## 🔧 Solución de Problemas

### Error: "Cannot find module '@/sensores/SensorsManager'"

Asegúrate de que los archivos estén en la carpeta `/sensores` y que estés usando rutas con alias:

```typescript
import SensorsManager from "@/sensores/SensorsManager";
```

### Permisos denegados en iOS

Verifica que `app.json` tenga las claves de permiso en `infoPlist`

### Permisos denegados en Android

- Comprueba que en tiempo de ejecución pidas permisos
- Usa `requestCameraPermission()` antes de acceder a cámara
- Usa `requestMicrophonePermission()` antes de acceder a micrófono

### Los sensores no devuelven datos

1. Verifica que el dispositivo tenga el sensor (no todos tienen barómetro)
2. Asegúrate de haber suscrito correctamente: `sensorsManager.subscribeToXxx()`
3. Revisa la consola para mensajes de error

### La app se cierra al acceder a cámara

- Verifica que hayas instalado `expo-camera`
- Revisa que los permisos estén configurados correctamente

---

## 📚 Ejemplos para app-class

### Detector de Caídas en una Pantalla

```typescript
// app/(app)/fall-detector.tsx
import { useShakeDetection } from '@/sensores/useSensorHooks';
import { View, Text, Alert } from 'react-native';

export default function FallDetector() {
  useShakeDetection(() => {
    Alert.alert('¡Se detectó una caída!', 'Se alertará a los contactos');
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Sistema de detección de caídas
      </Text>
      <Text style={{ color: '#666', marginTop: 10 }}>
        Activo y monitoreando...
      </Text>
    </View>
  );
}
```

### Brújula en Pantalla Tab

```typescript
// app/(tabs)/compass.tsx
import { useCompass } from '@/sensores/useSensorHooks';
import { View, Text, StyleSheet } from 'react-native';

export default function CompassScreen() {
  const { heading, direction } = useCompass();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading.toFixed(0)}°</Text>
      <Text style={styles.direction}>{direction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 48, fontWeight: 'bold' },
  direction: { fontSize: 32, marginTop: 20 },
});
```

---

## 📞 Soporte y Referencias

1. Documentación oficial de Expo:
   - https://docs.expo.dev/versions/latest/sdk/sensors/
   - https://docs.expo.dev/versions/latest/sdk/camera/

2. Documentación del proyecto app-class:
   - Ver [sensores.md](./sensores.md) para detalles técnicos completos

3. Actualiza Expo a la versión más reciente:
   ```bash
   npm install expo@latest
   ```

---

**Última actualización:** Enero 2026
**Proyecto:** app-class (Expo 54.0.30, React Native 0.81.5)
