import React, { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  LayoutChangeEvent, 
  Modal, 
  Pressable, // Usamos Pressable pra detectar o toque longo
  Platform
} from 'react-native';
import { Audio } from 'expo-av';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { PomodoroContext } from '../../context/PomodoroContext';

// Importe aqui o seu componente de Configurações real
// import SettingsScreen from '../screens/SettingsScreen'; 

const MODES = {
  POMODORO: 'Pomodoro',
  SHORT_BREAK: 'Descanso Curto',
  LONG_BREAK: 'Descanso Longo',
};

const PomodoroBlockContent = () => {
  const { 
    pomodoroTime, shortBreakTime, longBreakTime, 
    cyclesCompleted, setCyclesCompleted 
  } = useContext(PomodoroContext);

  const [currentMode, setCurrentMode] = useState(MODES.POMODORO);
  const [endTime, setEndTime] = useState<number | null>(null);
  
  // Estado do tempo restante
  const [timeLeft, setTimeLeft] = useState(pomodoroTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  // Layout responsivo
  const [circleSize, setCircleSize] = useState(200);
  const [showCircle, setShowCircle] = useState(true);
  const [dynamicFontSize, setDynamicFontSize] = useState(40);

  // ✨ NOVO: Controle do Modal de Configurações ✨
  const [isSettingsVisible, setSettingsVisible] = useState(false);

  const circularProgressRef = useRef<AnimatedCircularProgress>(null);

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

  // ✨ FIX 1: O Salvador da Pátria das Configurações ✨
  // Esse useEffect "ouve" quando o totalSecondsForMode muda (ou seja, quando vc salva no contexto).
  // Assim que mudar, ele reseta o timer automaticamente.
  useEffect(() => {
    resetTimer();
  }, [totalSecondsForMode]);

  const resetTimer = () => {
    setTimeLeft(totalSecondsForMode);
    setIsRunning(false);
    setEndTime(null);
    if (showCircle) {
      circularProgressRef.current?.reAnimate(0, 100, 500);
    }
  };

  const onLayoutContainer = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const heightBreakpoint = 160;

    if (height < heightBreakpoint) {
        setShowCircle(false);
        setDynamicFontSize(Math.max(32, height * 0.4)); 
    } else {
        setShowCircle(true);
        const size = Math.min(width, height) - 20; 
        const calculatedSize = size > 0 ? size : 200;
        setCircleSize(calculatedSize);
        setDynamicFontSize(Math.max(16, calculatedSize * 0.25));
    }
  }, []);

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

  // Carrega o som
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/bell.mp3'));
        setSound(sound);
      } catch (e) { console.log("Erro som") }
    };
    loadSound();
    return () => { sound?.unloadAsync(); };
  }, []);

  // Timer Loop
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

  const handleStartStop = () => {
    if (!isRunning) {
      setEndTime(Date.now() + timeLeft * 1000);
    } else {
      setEndTime(null);
    }
    setIsRunning(!isRunning);
  };

  const handleSkip = () => handleModeSwitch();

  // ✨ INTERAÇÃO DE HOLD (Segurar) ✨
  const handleLongPress = () => {
    // Vibração tátil seria legal aqui, mas vamos abrir o modal
    setSettingsVisible(true);
  };

  const tintColor = currentMode === MODES.POMODORO ? '#000' : '#8A2BE2';
  const subtitleText = currentMode === MODES.POMODORO ? 'focusing' : 'break';

  return (
    <View style={pomodoroStyles.contentContainer}>
      
      {/* ✨ MODAL NATIVO ESTILO "CARD" ✨ */}
      <Modal
        animationType="slide"
        transparent={false} // pageSheet geralmente não é transparente no fundo
        visible={isSettingsVisible}
        // No iOS, 'pageSheet' cria aquele card que dá pra puxar pra baixo pra fechar!
        presentationStyle="pageSheet" 
        onRequestClose={() => setSettingsVisible(false)} // Necessário pro Android (botão voltar)
      >
        <View style={pomodoroStyles.modalContainer}>
            {/* Aqui dentro você renderiza o seu formulário de configurações */}
            <Text style={pomodoroStyles.modalTitle}>Configurações</Text>
            <Text style={{textAlign: 'center', color: '#666', marginBottom: 20}}>
                Ajuste os tempos do Pomodoro aqui.
            </Text>
            
            {/* Exemplo de botão de fechar (caso o usuário não arraste) */}
            <TouchableOpacity 
                style={[pomodoroStyles.button, {backgroundColor: '#000'}]} 
                onPress={() => setSettingsVisible(false)}
            >
                <Text style={[pomodoroStyles.buttonText, {color: '#fff'}]}>Salvar e Fechar</Text>
            </TouchableOpacity>
        </View>
      </Modal>

      <View style={pomodoroStyles.titleContainer}>
        <Text style={pomodoroStyles.title}>Pomodoro</Text>
        <Text style={pomodoroStyles.subtitle}>{subtitleText}</Text>
      </View>

      {/* ✨ PRESSABLE NO CÍRCULO ✨ */}
      {/* Envolvi o circleWrapper num Pressable pra detectar o Long Press */}
      {/* <Pressable 
        style={pomodoroStyles.circleWrapper} 
        onLayout={onLayoutContainer}
        onLongPress={handleLongPress}
        delayLongPress={500} // Meio segundo segurando pra ativar
        // Feedback visual quando pressiona
        style={({ pressed }) => [
            pomodoroStyles.circleWrapper,
            { opacity: pressed ? 0.7 : 1 }
        ]}
      > */}
        {showCircle ? (
            <AnimatedCircularProgress
              ref={circularProgressRef}
              size={circleSize} 
              width={10} 
              fill={totalSecondsForMode > 0 ? (timeLeft / totalSecondsForMode) * 100 : 0}
              tintColor={tintColor}
              backgroundColor="#e0e0e068"
              lineCap="round"
              rotation={0}
            >
              {() => (
                <Text style={[pomodoroStyles.timerText, { fontSize: dynamicFontSize }]}>
                  {formatTime(timeLeft)}
                </Text>
              )}
            </AnimatedCircularProgress>
        ) : (
            <Text style={[pomodoroStyles.timerText, { fontSize: dynamicFontSize }]}>
              {formatTime(timeLeft)}
            </Text>
        )}
      {/* </Pressable> */}

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
  contentContainer: { 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    flex: 1, 
    width: '100%',
    // paddingVertical: 10,
  },
  titleContainer: { alignItems: "center", marginBottom: 5 },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#888' },
  
  circleWrapper: {
    flex: 1, 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  timerText: { 
    fontWeight: 'bold', 
    color: '#333' 
  },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 10 },
  button: { backgroundColor: '#fff', borderRadius: 50, paddingHorizontal: 24, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc' },
  buttonText: { fontSize: 12, color: '#333', fontWeight: 'bold' },
  skipButton: { backgroundColor: '#f0f0f0', borderRadius: 50, paddingHorizontal: 24, paddingVertical: 8, borderWidth: 1, borderColor: '#ddd' },
  skipButtonText: { fontSize: 18, color: '#888', fontWeight: 'bold' },

  // Estilos simples pro Modal de exemplo
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff' // Importante ter fundo no modal
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

export default PomodoroBlockContent;