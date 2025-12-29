import React from 'react';
import { StyleSheet, View } from 'react-native';
import PomodoroBlockContent from './pomodoroBlockContent';


interface PomodoroBlockProps {
  style?: ViewStyle;
}

const PomodoroBlock = ({ style }: PomodoroBlockProps) => {
  return (
    <View style={[styles.card, style]}>
      <PomodoroBlockContent />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flex: 1, 
    width: '100%', 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default PomodoroBlock;