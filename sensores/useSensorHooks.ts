/**
 * Ejemplos prácticos de casos de uso común
 * Copiar y adaptar según necesites
 */

import { useState, useRef, useEffect } from 'react';
import SensorsManager from './SensorsManager';

// ========================= DETECTOR DE CAÍDAS =========================

/**
 * Hook para detectar caídas del dispositivo
 */
export const useShakeDetection = (callback: () => void) => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const lastShakeRef = useRef(0);
  const SHAKE_THRESHOLD = 25; // m/s²
  const SHAKE_COOLDOWN = 500; // ms

  useEffect(() => {
    sensorsManager.subscribeToAccelerometer((data) => {
      // Calcular la magnitud total de aceleración
      const totalAcceleration = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)
      );

      // Detectar sacudida
      if (totalAcceleration > SHAKE_THRESHOLD) {
        const now = Date.now();
        if (now - lastShakeRef.current > SHAKE_COOLDOWN) {
          callback();
          lastShakeRef.current = now;
        }
      }
    });

    return () => sensorsManager.unsubscribeFromAccelerometer();
  }, [callback]);
};

// ========================= CONTADOR DE PASOS =========================

/**
 * Hook para contar pasos usando acelerómetro
 */
export const useStepCounter = () => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const [steps, setSteps] = useState(0);
  const lastPeakRef = useRef(0);
  const STEP_THRESHOLD = 15; // m/s²

  useEffect(() => {
    sensorsManager.subscribeToAccelerometer((data) => {
      const magnitude = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)
      );

      // Detectar pico (posible paso)
      if (magnitude > STEP_THRESHOLD && Date.now() - lastPeakRef.current > 250) {
        setSteps((prev) => prev + 1);
        lastPeakRef.current = Date.now();
      }
    });

    return () => sensorsManager.unsubscribeFromAccelerometer();
  }, []);

  return steps;
};

// ========================= BRÚJULA INTELIGENTE =========================

/**
 * Hook para obtener dirección cardinal
 */
export const useCompass = () => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const [heading, setHeading] = useState(0);
  const [direction, setDirection] = useState('N');

  useEffect(() => {
    sensorsManager.subscribeToMagnetometer((data) => {
      // Calcular heading del magnetómetro
      const h = Math.atan2(data.y, data.x) * (180 / Math.PI);
      const heading = h < 0 ? h + 360 : h;
      setHeading(heading);

      // Convertir a dirección cardinal
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(heading / 22.5) % 16;
      setDirection(directions[index]);
    });

    return () => sensorsManager.unsubscribeFromMagnetometer();
  }, []);

  return { heading, direction };
};

// ========================= SENSOR DE INCLINACIÓN =========================

/**
 * Hook para detectar inclinación del dispositivo
 */
export const useTiltDetection = () => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const [tilt, setTilt] = useState({
    pitch: 0, // inclinación hacia adelante/atrás
    roll: 0,  // inclinación izquierda/derecha
    yaw: 0,   // rotación
  });

  useEffect(() => {
    sensorsManager.subscribeToAccelerometer((accel) => {
      const pitch = Math.atan2(accel.y, accel.z) * (180 / Math.PI);
      const roll = Math.atan2(accel.x, accel.z) * (180 / Math.PI);

      setTilt((prev) => ({
        ...prev,
        pitch,
        roll,
      }));
    });

    sensorsManager.subscribeToGyroscope((gyro) => {
      // El giroscopio nos da velocidad angular
      // Integrando obtenemos ángulos más precisos
      setTilt((prev) => ({
        ...prev,
        yaw: gyro.z * (180 / Math.PI),
      }));
    });

    return () => {
      sensorsManager.unsubscribeFromAccelerometer();
      sensorsManager.unsubscribeFromGyroscope();
    };
  }, []);

  return tilt;
};

// ========================= GRABADOR DE VOZ CON DURACIÓN =========================

/**
 * Hook para grabar audio con contador de tiempo
 */
export const useAudioRecorder = () => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const recordingRef = useRef(null);
  const timerRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const startRecording = async () => {
    const recording = await sensorsManager.recordAudio();
    if (recording) {
      recordingRef.current = recording;
      setIsRecording(true);
      setDuration(0);

      // Contador de tiempo
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (recordingRef.current && timerRef.current) {
      clearInterval(timerRef.current);
      const uri = await sensorsManager.stopRecordingAudio(recordingRef.current);
      setIsRecording(false);
      return uri;
    }
  };

  return {
    isRecording,
    duration,
    startRecording,
    stopRecording,
  };
};

// ========================= DETECTOR DE ALTITUD =========================

/**
 * Hook para rastrear cambios de altitud
 */
export const useAltitudeTracker = () => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const [altitude, setAltitude] = useState(0);
  const [maxAltitude, setMaxAltitude] = useState(0);
  const [minAltitude, setMinAltitude] = useState(0);

  useEffect(() => {
    sensorsManager.subscribeToBarometer((data) => {
      setAltitude(data.relativeAltitude);
      setMaxAltitude((prev) => Math.max(prev, data.relativeAltitude));
      setMinAltitude((prev) => Math.min(prev, data.relativeAltitude));
    });

    return () => sensorsManager.unsubscribeFromBarometer();
  }, []);

  return {
    currentAltitude: altitude,
    maxAltitude,
    minAltitude,
  };
};

// ========================= MONITOR DE ORIENTACIÓN =========================

/**
 * Hook para monitorear la orientación del dispositivo
 */
export const useDeviceOrientation = () => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const [isPortrait, setIsPortrait] = useState(true);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  useEffect(() => {
    sensorsManager.subscribeToAccelerometer((data) => {
      // Calcular ángulos
      const x = Math.atan2(data.y, Math.sqrt(data.x * data.x + data.z * data.z)) *
        (180 / Math.PI);
      const y = Math.atan2(data.x, Math.sqrt(data.y * data.y + data.z * data.z)) *
        (180 / Math.PI);

      setTiltX(x);
      setTiltY(y);

      // Determinar si está en orientación portrait o landscape
      const isPortraitOrientation = Math.abs(x) < 45;
      setIsPortrait(isPortraitOrientation);
    });

    return () => sensorsManager.unsubscribeFromAccelerometer();
  }, []);

  return {
    isPortrait,
    tiltX,
    tiltY,
  };
};

// ========================= DETECTOR DE INMOBILIDAD =========================

/**
 * Hook para detectar si el dispositivo está quieto
 */
export const useStationaryDetection = (threshold = 1, timeout = 3000) => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const [isStationary, setIsStationary] = useState(false);
  const stationaryTimerRef = useRef(null);

  useEffect(() => {
    sensorsManager.subscribeToAccelerometer((data) => {
      const acceleration = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)
      );

      if (acceleration < threshold) {
        // Comenzar timer de inmobilidad
        if (!stationaryTimerRef.current) {
          stationaryTimerRef.current = setTimeout(() => {
            setIsStationary(true);
          }, timeout);
        }
      } else {
        // Hay movimiento, resetear timer
        if (stationaryTimerRef.current) {
          clearTimeout(stationaryTimerRef.current);
          stationaryTimerRef.current = null;
          setIsStationary(false);
        }
      }
    });

    return () => {
      sensorsManager.unsubscribeFromAccelerometer();
      if (stationaryTimerRef.current) {
        clearTimeout(stationaryTimerRef.current);
      }
    };
  }, [threshold, timeout]);

  return isStationary;
};

// ========================= MONITOR DE VELOCIDAD =========================

/**
 * Hook para calcular velocidad basada en aceleración
 */
export const useSpeedEstimate = () => {
  const sensorsManager = useRef(new SensorsManager()).current;
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    sensorsManager.subscribeToAccelerometer((data) => {
      const now = Date.now();
      const deltaTime = (now - lastTimeRef.current) / 1000; // segundos

      // Integrar aceleración para obtener velocidad
      velocityRef.current.x += data.x * deltaTime;
      velocityRef.current.y += data.y * deltaTime;
      velocityRef.current.z += data.z * deltaTime;

      // Calcular magnitud de velocidad
      const currentSpeed = Math.sqrt(
        Math.pow(velocityRef.current.x, 2) +
        Math.pow(velocityRef.current.y, 2) +
        Math.pow(velocityRef.current.z, 2)
      );

      setSpeed(currentSpeed);
      setDistance((prev) => prev + currentSpeed * deltaTime);
      lastTimeRef.current = now;
    });

    return () => sensorsManager.unsubscribeFromAccelerometer();
  }, []);

  return {
    currentSpeed: speed,
    totalDistance: distance,
  };
};

// ========================= EXPORTAR TODOS LOS HOOKS =========================

export default {
  useShakeDetection,
  useStepCounter,
  useCompass,
  useTiltDetection,
  useAudioRecorder,
  useAltitudeTracker,
  useDeviceOrientation,
  useStationaryDetection,
  useSpeedEstimate,
};
