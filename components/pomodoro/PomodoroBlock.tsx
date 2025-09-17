import React from 'react';
import { StyleSheet, View } from 'react-native';
import PomodoroBlockContent from './pomodoroBlockContent';

const PomodoroBlock = () => {
  return (
    <View style={styles.card}>
      <PomodoroBlockContent />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: 60,
    width: '95%',
    height: 'auto',
  },
});

export default PomodoroBlock;