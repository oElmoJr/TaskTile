import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; 

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#8A2BE2', // Roxo combinando com seu tema
      headerShown: false, // Geralmente a gente esconde o header padrão
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings" // Se o nome do arquivo for settings.tsx
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color }) => <FontAwesome name="gear" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}