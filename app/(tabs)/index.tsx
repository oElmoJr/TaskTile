import PomodoroBlock from '@/components/pomodoro/PomodoroBlock';
import { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';

const initialBlocks = [
  { id: '1', title: 'Pomodoro', type: 'pomodoro' },
];

export default function HomeScreen() {
  const [data, setData] = useState(initialBlocks);

 const renderItem = () => (
  <PomodoroBlock />
);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});