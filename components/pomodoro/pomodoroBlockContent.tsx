import { Audio } from 'expo-av';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { PomodoroContext } from '../../app/(tabs)/_layout';

// ✨ Defina os modos do timer e o status para alternar
const MODES = {
  POMODORO: 'Pomodoro',
  SHORT_BREAK: 'Descanso Curto',
  LONG_BREAK: 'Descanso Longo',
};

const PomodoroBlockContent = () => {
  const { pomodoroTime, shortBreakTime, longBreakTime, cyclesCompleted, setCyclesCompleted } = useContext(PomodoroContext);
  
  // ✨ Novo estado para o modo atual (pomodoro ou descanso)
  const [currentMode, setCurrentMode] = useState(MODES.POMODORO);
  
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const circularProgressRef = useRef<AnimatedCircularProgress>(null);

  useEffect(() => {
    setIsRunning(false);
    // Reinicia o tempo e a animação dependendo do modo atual
    let durationInSeconds;
    if (currentMode === MODES.POMODORO) {
      durationInSeconds = pomodoroTime * 60;
    } else if (currentMode === MODES.SHORT_BREAK) {
      durationInSeconds = shortBreakTime * 60;
    } else {
      durationInSeconds = longBreakTime * 60;
    }
    setTimeLeft(durationInSeconds);
    if (circularProgressRef.current) {
      circularProgressRef.current.reAnimate(0, 100, 500);
    }
  }, [pomodoroTime, shortBreakTime, longBreakTime, currentMode]);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/bell.mp3')
      );
      setSound(sound);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            if (sound) {
              sound.replayAsync();
            }
            if (currentMode === MODES.POMODORO) {
              setCyclesCompleted(cyclesCompleted + 1);
              if ((cyclesCompleted + 1) % 4 === 0) {
                setCurrentMode(MODES.LONG_BREAK);
              } else {
                setCurrentMode(MODES.SHORT_BREAK);
              }
            } else {
              setCurrentMode(MODES.POMODORO);
            }
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, sound, currentMode, cyclesCompleted]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };
  
  const handleSkip = () => {
    setCurrentMode(MODES.POMODORO);
    setIsRunning(false);
  };
  
  const buttonText = isRunning ? 'Stop' : 'Start';
  const displayTime = formatTime(timeLeft);
  
  // ✨ MÁGICA AQUI: essa variável vai ter a duração total do modo atual.
  const totalDisplayTime =
    currentMode === MODES.POMODORO
      ? pomodoroTime * 60
      : currentMode === MODES.SHORT_BREAK
      ? shortBreakTime * 60
      : longBreakTime * 60;

  // ✨ Escolha a cor do círculo e a legenda com base no modo
  const tintColor = currentMode === MODES.POMODORO ? '#000' : '#8A2BE2'; // Roxo pro descanso
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
        fill={timeLeft / totalDisplayTime * 100} // ✨ Agora usamos a nova variável!
        tintColor={tintColor}
        backgroundColor="#e0e0e068"
        lineCap="round"
        style={pomodoroStyles.progressCircle}
        rotation={0}
      >
        {() => (
          <Text style={pomodoroStyles.timerText}>
            {displayTime}
          </Text>
        )}
      </AnimatedCircularProgress>

      <View style={pomodoroStyles.controls}>
        {currentMode !== MODES.POMODORO && (
          <TouchableOpacity style={pomodoroStyles.skipButton} onPress={handleSkip}>
            <Text style={pomodoroStyles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={pomodoroStyles.button} onPress={handleStartStop}>
          <Text style={pomodoroStyles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const pomodoroStyles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  titleContainer: {
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  progressCircle: {},
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  skipButtonText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  }
});

export default PomodoroBlockContent;