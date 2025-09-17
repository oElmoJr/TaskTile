import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PomodoroContext } from '../../app/(tabs)/_layout';

const PomodoroSettings = () => {
  const { pomodoroTime, setPomodoroTime, shortBreakTime, setShortBreakTime, longBreakTime, setLongBreakTime } = useContext(PomodoroContext);
  
  const [inputPomodoroTime, setInputPomodoroTime] = useState(String(pomodoroTime));
  const [inputShortBreakTime, setInputShortBreakTime] = useState(String(shortBreakTime));
  const [inputLongBreakTime, setInputLongBreakTime] = useState(String(longBreakTime));

  const handleSave = () => {
    const newPomodoroTime = Number(inputPomodoroTime);
    const newShortBreakTime = Number(inputShortBreakTime);
    const newLongBreakTime = Number(inputLongBreakTime);

    if (!isNaN(newPomodoroTime) && newPomodoroTime > 0 &&
        !isNaN(newShortBreakTime) && newShortBreakTime > 0 &&
        !isNaN(newLongBreakTime) && newLongBreakTime > 0) {
      setPomodoroTime(newPomodoroTime);
      setShortBreakTime(newShortBreakTime);
      setLongBreakTime(newLongBreakTime);
      Alert.alert('Configurações salvas!', 'Seus novos tempos de Pomodoro e descanso foram salvos.');
      router.back();
    } else {
      Alert.alert('Erro', 'Por favor, digite números válidos e maiores que zero.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tempo do Pomodoro (minutos)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={inputPomodoroTime}
        onChangeText={setInputPomodoroTime}
      />
      <Text style={styles.label}>Tempo de Descanso Curto (minutos)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={inputShortBreakTime}
        onChangeText={setInputShortBreakTime}
      />
      <Text style={styles.label}>Tempo de Descanso Longo (minutos)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={inputLongBreakTime}
        onChangeText={setInputLongBreakTime}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PomodoroSettings;