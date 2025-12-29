import { Slot } from 'expo-router';
import { PomodoroProvider } from '../context/PomodoroContext'; // Importando do lugar certo!

export default function RootLayout() {
  return (
    // ✨ O Provider abraça a aplicação inteira
    <PomodoroProvider>
      <Slot /> 
    </PomodoroProvider>
  );
}