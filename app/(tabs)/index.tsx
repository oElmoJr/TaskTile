import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PomodoroBlock from '@/components/pomodoro/PomodoroBlock';
import BlockSettingsSheet, { BlockData } from '@/components/BlockSettingsSheet';

// --- CONFIGS DO GRID ---
const COLUMN_GAP = 12; // Espaço entre os blocos
const BASE_HEIGHT = 170; // Altura de uma linha (1x)

// Adicionamos 'height' na interface e nos dados
const initialBlocks: BlockData[] = [
  { 
    id: '1', 
    title: 'Pomodoro Gigante', 
    type: 'pomodoro',
    width: 2,   // 2 Colunas (Largura total)
    height: 2,  // 2 Linhas (Altão) -> 2x2
    settings: { focusTime: '25:00', shortBreak: '05:00', longBreak: '15:00', hasLongBreak: true, cycles: 4 }
  },
  { 
    id: '2', 
    title: 'Pomodoro Pequeno', 
    type: 'pomodoro',
    width: 1,  // 1 Coluna (Metade)
    height: 1, // 1 Linha (Padrão) -> 1x1
    settings: { focusTime: '15:00', shortBreak: '02:00', longBreak: '10:00', hasLongBreak: false, cycles: 3 }
  },
];

export default function HomeScreen() {
  const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null);
  const [isSheetVisible, setSheetVisible] = useState(false);

  const handleLongPress = (block: BlockData) => {
    setSelectedBlock(block);
    setSheetVisible(true);
  };

  const handleSaveBlock = (updatedBlock: BlockData) => {
    setBlocks(currentBlocks => 
      currentBlocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {blocks.map((block) => {
          // 1. Lógica da LARGURA (Width)
          const isFullWidth = block.width && block.width >= 2;
          const itemWidth = isFullWidth ? '100%' : '48%'; // 48% deixa espaço pro gap

          // 2. Lógica da ALTURA (Height) - A Mágica Matemática 🧮
          // Se não tiver height definido, assume 1
          const h = block.height || 1; 
          // Altura = (Base * N) + (Gap * (N-1))
          const itemHeight = (BASE_HEIGHT * h) + (COLUMN_GAP * (h - 1));

          return (
            <TouchableOpacity 
              key={block.id}
              // Aplicamos width e height dinâmicos aqui no wrapper
              style={[styles.blockWrapper, { width: itemWidth, height: itemHeight }]}
              activeOpacity={0.9}
              onLongPress={() => handleLongPress(block)}
              delayLongPress={300}
            >
              {/* O BentoCell agora herda o tamanho do pai (flex: 1) */}
              <View style={styles.bentoCell}>
                <PomodoroBlock /> 
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>

      <BlockSettingsSheet
        visible={isSheetVisible}
        onClose={() => setSheetVisible(false)}
        blockData={selectedBlock}
        onSave={handleSaveBlock}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f6',
  },
  scrollContent: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: COLUMN_GAP, // Gap constante
    paddingBottom: 100, // Espaço extra no final
  },
  blockWrapper: {
    // Não precisa de margin bottom se usar 'gap' no container pai (React Native novo suporta gap)
    // Se seu RN for antigo, descomente a linha abaixo:
    // marginBottom: COLUMN_GAP, 
  },
  bentoCell: {
    flex: 1, // Ocupa todo o espaço do wrapper calculado
    borderRadius: 24,
    backgroundColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
});