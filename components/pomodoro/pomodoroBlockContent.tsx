import { Audio } from 'expo-av';
import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { PomodoroContext } from '../../app/(tabs)/_layout';

const MODES = {
  POMODORO: 'Pomodoro',
  SHORT_BREAK: 'Descanso Curto',
  LONG_BREAK: 'Descanso Longo',
};

 const PomodoroBlockContent = () => {
  // --- 1. Contexto e Estados ---
  const { 
    pomodoroTime, shortBreakTime, longBreakTime, 
    cyclesCompleted, setCyclesCompleted 
  } = useContext(PomodoroContext);

  const [currentMode, setCurrentMode] = useState(MODES.POMODORO);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const circularProgressRef = useRef<AnimatedCircularProgress>(null);

  // --- 2. Helpers (Cálculos memorizados para performance ✨) ---
  const totalSecondsForMode = useMemo(() => {
    if (currentMode === MODES.POMODORO) return pomodoroTime * 60;
    if (currentMode === MODES.SHORT_BREAK) return shortBreakTime * 60;
    return longBreakTime * 60;
  }, [currentMode, pomodoroTime, shortBreakTime, longBreakTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- 3. Lógica de Troca de Modo ---
  const handleModeSwitch = useCallback(() => {
    if (currentMode === MODES.POMODORO) {
      const nextCycle = cyclesCompleted + 1;
      setCyclesCompleted(nextCycle);
      setCurrentMode(nextCycle % 4 === 0 ? MODES.LONG_BREAK : MODES.SHORT_BREAK);
    } else {
      setCurrentMode(MODES.POMODORO);
    }
    setIsRunning(false);
    setEndTime(null);
  }, [currentMode, cyclesCompleted, setCyclesCompleted]);

  // --- 4. Efeitos (Side Effects) ---

  // Carregar som inicial 🔔
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/bell.mp3'));
      setSound(sound);
    };
    loadSound();
    return () => { sound?.unloadAsync(); };
  }, []);

  // Resetar timer quando o modo ou as configs mudarem
  useEffect(() => {
    setTimeLeft(totalSecondsForMode);
    setIsRunning(false);
    setEndTime(null);
    circularProgressRef.current?.reAnimate(0, 100, 500);
  }, [totalSecondsForMode]);

  // O Coração: Intervalo baseado em Timestamp ⏱️
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const difference = Math.ceil((endTime - now) / 1000);

        if (difference <= 0) {
          setTimeLeft(0);
          sound?.replayAsync();
          handleModeSwitch();
        } else {
          setTimeLeft(difference);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, endTime, sound, handleModeSwitch]);

  // --- 5. Ações do Usuário ---
  const handleStartStop = () => {
    if (!isRunning) {
      setEndTime(Date.now() + timeLeft * 1000);
    } else {
      setEndTime(null);
    }
    setIsRunning(!isRunning);
  };

  const handleSkip = () => {
    handleModeSwitch();
  };

  // --- 6. UI Configs ---
  const tintColor = currentMode === MODES.POMODORO ? '#000' : '#8A2BE2';
  const subtitleText = currentMode === MODES.POMODORO ? 'focusing' : 'break';

  return (
    <View style={pomodoroStyles.contentContainer}>
      <View style={pomodoroStyles.titleContainer}>
        <Text style={pomodoroStyles.title}>Pomodoro</Text>
        <Text style={pomodoroStyles.subtitle}>{subtitleText}</Text>
      </View>

      <AnimatedCircularProgress
        ref={circularProgressRef}
        size={180}
        width={10}
        fill={(timeLeft / totalSecondsForMode) * 100}
        tintColor={tintColor}
        backgroundColor="#e0e0e068"
        lineCap="round"
        rotation={0}
      >
        {() => (
          <Text style={pomodoroStyles.timerText}>{formatTime(timeLeft)}</Text>
        )}
      </AnimatedCircularProgress>

      <View style={pomodoroStyles.controls}>
        {currentMode !== MODES.POMODORO && (
          <TouchableOpacity style={pomodoroStyles.skipButton} onPress={handleSkip}>
            <Text style={pomodoroStyles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={pomodoroStyles.button} onPress={handleStartStop}>
          <Text style={pomodoroStyles.buttonText}>{isRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

};

const pomodoroStyles = StyleSheet.create({
  contentContainer: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  titleContainer: { alignItems: "center", marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#888' },
  timerText: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 20 },
  button: { backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 24, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc' },
  buttonText: { fontSize: 18, color: '#333', fontWeight: 'bold' },
  skipButton: { backgroundColor: '#f0f0f0', borderRadius: 50, paddingHorizontal: 24, paddingVertical: 8, borderWidth: 1, borderColor: '#ddd' },
  skipButtonText: { fontSize: 18, color: '#888', fontWeight: 'bold' }
});

export default PomodoroBlockContent;