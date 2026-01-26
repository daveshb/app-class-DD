# 📱 Guía: Convertir App Expo (app-class) a APK e Instalar en Android

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Paso 1: Preparar el Proyecto](#paso-1-preparar-el-proyecto)
3. [Paso 2: Generar Keystore](#paso-2-generar-keystore)
4. [Paso 3: Configurar Expo EAS](#paso-3-configurar-expo-eas)
5. [Paso 4: Construir el APK](#paso-4-construir-el-apk)
6. [Paso 5: Instalar en Dispositivo](#paso-5-instalar-en-dispositivo)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

### Software Necesario

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **Expo CLI** (herramienta oficial de Expo)
- **JDK** (Java Development Kit 11 o superior) - Requerido para APK
- **Android Studio** (opcional pero recomendado para emuladores)

### Verificar Instalación

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Expo CLI
expo --version

# Verificar JDK
java -version
```

### Instalar Expo CLI (si no lo tienes)

```bash
npm install -g expo-cli
```

### Variables de Entorno (macOS/Linux) - Opcional

```bash
# Agregar a ~/.zshrc o ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## 📁 Paso 1: Preparar el Proyecto

### 1.1 Estructura del Proyecto Expo

Tu proyecto **app-class** ya tiene la estructura correcta:

```
app-class/
├── app/                   # Código de la aplicación (expo-router)
│   ├── _layout.tsx
│   ├── (app)/
│   ├── (auth)/
│   ├── (tabs)/
│   └── ...
├── components/            # Componentes reutilizables
├── context/              # Context API
├── hooks/                # Custom hooks
├── services/             # Servicios (API, OpenAI, etc)
├── constants/            # Constantes y tema
├── assets/               # Imágenes y recursos
├── package.json          # Dependencias
├── app.json             # Configuración de Expo
├── expo-env.d.ts        # Types de Expo
└── tsconfig.json        # Configuración TypeScript
```

### 1.2 Verificar app.json

El archivo `app.json` debe tener la configuración correcta. Verifica que incluya:

```json
{
  "expo": {
    "name": "app-class",
    "slug": "app-class",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.appclass"
    }
  }
}
```

### 1.3 Instalar Dependencias

```bash
# Si no las has instalado aún
npm install
# o
yarn install
```

### 1.4 Probar el Proyecto Localmente

```bash
# Iniciar en modo desarrollo
npm start

# O directamente en Android:
npm run android
```

---

## 🔑 Paso 2: Generar Keystore (Firma Digital)

Para distribuir tu APK en Google Play o instalarla en dispositivos, necesitas firmarla con una clave privada.

### 2.1 Crear el Keystore

```bash
# macOS/Linux
keytool -genkeypair -v -keystore app-class-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias app-class-key -storepass tu_contraseña -keypass tu_contraseña

# Windows (reemplaza los \ por ^)
keytool -genkeypair -v -keystore app-class-key.keystore ^
  -keyalg RSA -keysize 2048 -validity 10000 ^
  -alias app-class-key -storepass tu_contraseña -keypass tu_contraseña
```

**Parámetros explicados:**

- `-keystore app-class-key.keystore`: Nombre del archivo de clave
- `-validity 10000`: Validez en días (~27 años)
- `-alias app-class-key`: Nombre identificador de la clave
- `-storepass`: Contraseña del almacén (usa una fuerte como "MySecure123!")
- `-keypass`: Contraseña de la clave (puede ser la misma)

### 2.2 Guardar el Keystore de Forma Segura

```bash
# Guardar en un lugar seguro
mkdir -p ~/.app-keys
mv app-class-key.keystore ~/.app-keys/
chmod 400 ~/.app-keys/app-class-key.keystore

# Verificar
ls -la ~/.app-keys/app-class-key.keystore
```

⚠️ **IMPORTANTE:**

- Guarda esta contraseña en un lugar seguro (gestor de contraseñas)
- NO comitas el keystore a GitHub
- Necesitarás esto para actualizaciones futuras en Google Play

---

## ⚙️ Paso 3: Configurar Expo EAS (Easiest Way)

La forma más sencilla es usar **EAS (Expo Application Services)**, que construye el APK en la nube:

### 3.1 Instalar y Configurar EAS CLI

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Verificar instalación
eas --version

# Login a tu cuenta Expo
eas login
```

> ℹ️ Necesitas una cuenta en [https://expo.dev](https://expo.dev). Es gratis registrarse.

### 3.2 Inicializar EAS en el Proyecto

```bash
cd /Users/davidestebanhenaobustamante/Desktop/APP-CLASS/app-class

# Configurar EAS
eas build:configure
```

Se creará un archivo `eas.json` con la configuración.

### 3.3 Verificar eas.json

Tu archivo `eas.json` debería verse así:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### 3.4 Alternativa: Construir Localmente (Avanzado)

Si prefieres construir localmente sin EAS:

```bash
# Generar proyecto Android nativo
expo prebuild --clean

# Luego construir con Gradle (ver Paso 4 alternativo)
cd android
./gradlew assembleRelease
```

⚠️ **Nota:** Esto requiere más configuración y es más complejo. Se recomienda usar EAS.

---

## 🔨 Paso 4: Construir el APK

### 4.1 Opción A: Con EAS Build (RECOMENDADO - Más Fácil)

```bash
# Construcción de producción con firma automática
eas build --platform android --build-type apk

# O simplemente:
eas build --platform android
```

**Pasos que hace EAS automáticamente:**

1. Carga tu código a los servidores de Expo
2. Compila la app en la nube
3. Firma automáticamente (EAS maneja el keystore)
4. Descarga el APK cuando está listo

**Verificar estado del build:**

```bash
# Ver builds en progreso
eas build:list

# Descargar APK completado
eas build:download
```

### 4.2 Opción B: Construcción Local (Avanzado)

Si decidiste usar `expo prebuild`:

```bash
# Generar el proyecto Android nativo (si no lo hiciste)
expo prebuild --clean

# Navegar a Android
cd android

# Compilar APK con firma
./gradlew assembleRelease

# Volver a la raíz
cd ..
```

**Ubicación del APK generado:**

```
android/app/build/outputs/apk/release/app-release.apk
```

### 4.3 Verificar el Build

```bash
# macOS/Linux - Ver información del APK
ls -lh app-class-release.apk

# Verificar firma (requiere keytool)
jarsigner -verify -verbose app-class-release.apk
```

---

## 📲 Paso 5: Instalar en Dispositivo Android

### 5.1 Preparar el Dispositivo

En el dispositivo Android:

1. Abre **Configuración** → **Acerca del teléfono**
2. Toca **Número de compilación** 7 veces (hasta activar modo desarrollador)
3. Regresa a **Configuración** → **Opciones de desarrollador**
4. Activa **Depuración USB**
5. Conecta el dispositivo con un cable USB a tu computadora

### 5.2 Instalar el APK

#### Opción A: Con ADB (Recomendado)

```bash
# Verificar que el dispositivo está conectado
adb devices

# Instalar el APK descargado desde EAS
adb install -r nombre-del-apk.apk

# O si lo construiste localmente:
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

Si `adb` no se encuentra:

```bash
# En macOS/Linux
export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools
adb devices
```

#### Opción B: Transferencia Manual

1. Copia el APK a tu dispositivo:

   ```bash
   adb push nombre-del-apk.apk /sdcard/Download/
   ```

2. En el dispositivo, abre **Archivos** → **Descargas**
3. Toca el APK
4. Toca **Instalar**
5. Espera a que termine

#### Opción C: Google Drive / Cloud

1. Sube el APK a Google Drive
2. Abre el archivo en tu dispositivo
3. Descárgalo
4. Instálalo desde Archivos

### 5.3 Verificar Instalación

```bash
# Ver aplicaciones instaladas
adb shell pm list packages | grep appclass

# Obtener ruta de la app
adb shell pm path com.appclass

# Desinstalar (si necesario)
adb uninstall com.appclass
```

### 5.4 Lanzar la App

```bash
# Desde terminal
adb shell am start -n com.appclass/.MainActivity

# O simplemente toca el ícono en el dispositivo
```

---

## 🚀 Paso 6: Monitoreo y Debugging

### 6.1 Ver Logs en Tiempo Real

```bash
# Todos los logs
adb logcat

# Filtrar por tu app
adb logcat | grep "app-class"

# Filtrar React Native logs
adb logcat | grep "ReactNativeJS"

# Limpiar logs
adb logcat -c

# Ver con timestamp
adb logcat -v time
```

### 6.2 Captura de Pantalla

```bash
# Tomar screenshot
adb shell screencap -p /sdcard/screenshot.png

# Descargar a tu PC
adb pull /sdcard/screenshot.png ~/Desktop/

# Grabar pantalla (máx 180 segundos)
adb shell screenrecord --time-limit 30 /sdcard/video.mp4
adb pull /sdcard/video.mp4 ~/Desktop/
```

### 6.3 Debugging en Desarrollo

Para desarrollo en emulador:

```bash
# Emulador de Android
npm run android

# O con Expo directamente
expo start --android
```

### 6.4 Usar Desarrollo Builds de Expo (Avanzado)

Para debugging más profundo:

```bash
# Crear un development build
eas build --platform android --profile preview

# Instalar en emulador o dispositivo
adb install development-build.apk

# Conectar a tu máquina de desarrollo
expo start --dev-client
```

---

## ❌ Troubleshooting

### Error: "expo: command not found"

```bash
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Verificar
expo --version
```

### Error: "eas: command not found"

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Verificar
eas --version
```

### Error: "No credentials available"

```bash
# Login a tu cuenta Expo
eas login

# Verificar
eas whoami
```

### Error: "adb: command not found"

```bash
# macOS/Linux - Agregar a PATH
export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools

# Verificar dispositivos
adb devices
```

### Dispositivo No Aparece en adb devices

```bash
# Desconecta y reconecta el dispositivo

# Revisa que esté en modo desarrollo:
adb shell getprop ro.debuggable

# Reinicia adb
adb kill-server
adb start-server
adb devices
```

### La App No Se Instala (Error de Firma)

```bash
# Si usas EAS, esto es manejado automáticamente

# Si construyes localmente:
adb install -r android/app/build/outputs/apk/release/app-release.apk

# Desinstalar versión anterior
adb uninstall com.appclass
adb install android/app/build/outputs/apk/release/app-release.apk
```

### APK Muy Grande

Con Expo y EAS, el tamaño se optimiza automáticamente. Si compilas localmente:

```bash
# Usar bundleRelease en lugar de assembleRelease
cd android
./gradlew bundleRelease

# Genera un .aab (App Bundle) más pequeño para Google Play
cd ..
```

### Error: "java: command not found"

```bash
# Instalar Java (JDK)
# macOS con Homebrew:
brew install openjdk@11

# Agregar al PATH
export PATH="/usr/local/opt/openjdk@11/bin:$PATH"

# Verificar
java -version
```

### La App Crashea al Abrirse

```bash
# Ver logs de error
adb logcat | grep "FATAL\|ERROR\|Exception"

# Ver stack trace completo
adb logcat | grep "AndroidRuntime"

# Reinstalar la app
adb uninstall com.appclass
adb install -r app-class-release.apk
```

### Problemas de Conexión a API (OpenAI, etc)

```bash
# Verificar conectividad
adb shell ping 8.8.8.8

# Ver información de red
adb shell ifconfig

# Verificar permisos de red en app.json:
# "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
```

### Build Falla en EAS

```bash
# Ver detalles del error
eas build:view <BUILD_ID>

# Reintentar build
eas build --platform android --clear-cache

# Limpiar dependencias locales
rm -rf node_modules
npm install
```

---

## 📦 Distribuir en Google Play Store

### Requisitos

- Cuenta de Google Play Developer ($25 USD)
- App Bundle (.aab) generado y firmado
- Screenshots y descripciones

### Pasos

#### 1. Generar App Bundle con EAS

```bash
# EAS genera automáticamente App Bundle optimizado
eas build --platform android

# El build genera tanto APK como AAB
```

#### 2. Subir a Google Play Console

```bash
# Ir a https://play.google.com/console
# 1. Crear nueva aplicación
# 2. Rellenar información de la app
# 3. En "Versiones en producción" → "Crear versión"
# 4. Subir el AAB generado por EAS
# 5. Agregar screenshots, descripción, etc
# 6. Revisar y publicar
```

#### 3. Comandos Útiles

```bash
# Ver todos los builds
eas build:list --platform android

# Descargar un build específico
eas build:download <BUILD_ID>

# Ver detalles de un build
eas build:view <BUILD_ID>
```

---

## ✨ Checklist Final para Producción

Antes de lanzar tu app, verifica:

### Configuración de app.json

- [ ] Nombre y slug correctos: "app-class"
- [ ] Versión actualizada: "1.0.0"
- [ ] Icono y splash image presentes
- [ ] Paquete Android correcto: "com.appclass"
- [ ] AdaptiveIcon configurado

### Código y Funcionalidad

- [ ] Todas las rutas (expo-router) funcionan correctamente
- [ ] Servicios de API (OpenAI, usuarios, etc) configurados
- [ ] No hay console.logs en código de producción
- [ ] Manejo de errores implementado
- [ ] Permisos necesarios solicitados

### Seguridad

- [ ] Keystore generado y guardado de forma segura
- [ ] Contraseña fuerte del keystore
- [ ] Variables de entorno sensibles en .env (no en código)
- [ ] Dependencias actualizadas

### Testing

- [ ] App probada en emulador
- [ ] App probada en dispositivo real
- [ ] Logs debugged con `adb logcat`
- [ ] Funcionalidad de login/auth verificada
- [ ] Integración con servicios externa probada

### Build Final

- [ ] Credenciales de Expo válidas
- [ ] EAS build completado sin errores
- [ ] APK descargado y probado
- [ ] Firma digital verificada

---

## 📚 Referencias Útiles

- [Documentación Expo](https://docs.expo.dev/)
- [Expo EAS Build Docs](https://docs.expo.dev/build/)
- [Android Developer Guide](https://developer.android.com/)
- [ADB Command Reference](https://developer.android.com/studio/command-line/adb)
- [Google Play Console](https://play.google.com/console)
- [Expo Router Docs](https://docs.expo.dev/routing/introduction/)

---

## 🚀 Resumen Rápido (TL;DR)

```bash
# 1. Preparar
npm install

# 2. Crear cuenta Expo y login
eas login

# 3. Configurar EAS
eas build:configure

# 4. Construir APK en la nube
eas build --platform android --build-type apk

# 5. Instalar en dispositivo
adb install -r app-class-release.apk

# 6. Probar
adb logcat | grep "app-class"
```

---

**¡Tu app Expo está lista para Android! 🎉**

Para preguntas, visita: [https://docs.expo.dev/support](https://docs.expo.dev/support)
