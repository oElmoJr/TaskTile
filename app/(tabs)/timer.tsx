// Exemplo para timer.tsx (faça parecido para os outros)
import { StyleSheet, Text, View } from 'react-native';

export default function TimerScreen() {
  return (
    <View style={styles.container}>
      <Text>Tela do Timer!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});