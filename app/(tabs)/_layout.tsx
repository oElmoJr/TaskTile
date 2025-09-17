import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { createContext, useState } from 'react';

// Crie e exporte o Contexto para ser usado em outras telas
export const PomodoroContext = createContext({
  pomodoroTime: 25,
  setPomodoroTime: (time: number) => {},
  shortBreakTime: 5,
  setShortBreakTime: (time: number) => {},
  longBreakTime: 15,
  setLongBreakTime: (time: number) => {},
  cyclesCompleted: 0,
  setCyclesCompleted: (count: number) => {},
});

export default function TabLayout() {
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  return (
    <PomodoroContext.Provider
      value={{
        pomodoroTime,
        setPomodoroTime,
        shortBreakTime,
        setShortBreakTime,
        longBreakTime,
        setLongBreakTime,
        cyclesCompleted,
        setCyclesCompleted,
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: 60,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 5,
          },
          tabBarItemStyle: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={28}
                color={focused ? '#333' : '#888'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="timer"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'time' : 'time-outline'}
                size={28}
                color={focused ? '#333' : '#888'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={28}
                color={focused ? '#333' : '#888'}
              />
            ),
          }}
        />
      </Tabs>
    </PomodoroContext.Provider>
  );
}