import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native';

export interface BlockSettings {
  focusTime: string;
  shortBreak: string;
  longBreak: string;
  hasLongBreak: boolean;
  cycles: number;
}

export interface BlockData {
  id: string;
  title: string;
  type: string;
  width?: number;
  height?: number;
  settings?: BlockSettings;
  [key: string]: any;
}

interface BlockSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
  blockData: BlockData | null;
  onSave: (updatedBlock: BlockData) => void;
}

export default function BlockSettingsSheet({ visible, onClose, blockData, onSave }: BlockSettingsSheetProps) {
  // --- States ---
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  
  // Agora os states guardam APENAS os minutos (ex: "25", "5")
  const [focusTime, setFocusTime] = useState('25');
  const [shortBreak, setShortBreak] = useState('5');
  const [longBreak, setLongBreak] = useState('15');
  
  const [hasLongBreak, setHasLongBreak] = useState(true);
  const [cycles, setCycles] = useState(4);

  // Helper para extrair apenas os minutos da string "MM:SS"
  const getMinutes = (timeString: string) => {
    if (!timeString) return '';
    return timeString.split(':')[0]; // Pega o que tem antes dos dois pontos
  };

  useEffect(() => {
    if (visible && blockData) {
      setWidth(blockData.width || 1);
      setHeight(blockData.height || 1);
      
      const settings = blockData.settings || {} as BlockSettings;
      
      // Carrega limpando os segundos visualmente
      setFocusTime(getMinutes(settings.focusTime || '25:00'));
      setShortBreak(getMinutes(settings.shortBreak || '05:00'));
      setLongBreak(getMinutes(settings.longBreak || '15:00'));
      
      setHasLongBreak(settings.hasLongBreak !== undefined ? settings.hasLongBreak : true);
      setCycles(settings.cycles || 4);
    }
  }, [visible, blockData]);

  const handleSave = () => {
    if (!blockData) return;

    // Na hora de salvar, a gente devolve os segundos ":00" pro sistema
    const updatedBlock: BlockData = {
      ...blockData,
      width,
      height,
      settings: {
        focusTime: `${focusTime}:00`,
        shortBreak: `${shortBreak}:00`,
        longBreak: `${longBreak}:00`,
        hasLongBreak,
        cycles
      }
    };

    onSave(updatedBlock);
    onClose();
  };

  const renderTimeCard = (label: string, value: string, setter: (s: string) => void, disabled = false) => (
    <View style={[styles.timeCard, disabled && styles.disabledCard]}>
      <TextInput
        style={styles.timeInput}
        value={value}
        onChangeText={setter}
        editable={!disabled}
        keyboardType="number-pad" // Teclado numérico puro
        maxLength={3} // Permite até 999 minutos, exagerado mas seguro kkk
        placeholder="00"
      />
      <Text style={styles.label}>{label} (min)</Text>
    </View>
  );

  const renderCounter = (value: number, setValue: (n: number) => void, min = 1) => (
    <View style={styles.counterContainer}>
      <TouchableOpacity onPress={() => setValue(Math.max(min, value - 1))} style={styles.counterIconBtn}>
        <Text style={styles.iconText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity onPress={() => setValue(value + 1)} style={styles.counterIconBtn}>
        <Text style={styles.iconText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLayoutOption = (targetW: number, targetH: number, label: string) => {
    const isSelected = width === targetW && height === targetH;
    
    const miniBlockStyle = {
      width: targetW === 1 ? 14 : 28,
      height: targetH === 1 ? 14 : 28,
      backgroundColor: isSelected ? '#FFF' : '#555',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: isSelected ? '#FFF' : '#555',
    };

    return (
      <TouchableOpacity 
        style={[styles.layoutBtn, isSelected && styles.layoutBtnSelected]} 
        onPress={() => {
          setWidth(targetW);
          setHeight(targetH);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <View style={miniBlockStyle} />
        </View>
        <Text style={[styles.layoutBtnText, isSelected && styles.layoutBtnTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.sheetContainer}
          >
            <View style={styles.header}>
              <View style={styles.dragHandle} />
              <Text style={styles.title}>Editar {blockData?.title || 'Bloco'} 🍅</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              
              {/* --- Tempos (AGORA SÓ MINUTOS) --- */}
              <View style={styles.sectionTitleWrap}>
                <Text style={styles.sectionTitle}>Tempos</Text>
              </View>
              <View style={styles.timeRow}>
                {renderTimeCard('Foco', focusTime, setFocusTime)}
                {renderTimeCard('Curto', shortBreak, setShortBreak)}
                {renderTimeCard('Longo', longBreak, setLongBreak, !hasLongBreak)}
              </View>

              <View style={styles.divider} />

              {/* --- Configs Gerais --- */}
              <View style={styles.row}>
                <Text style={styles.optionText}>Descanso Longo</Text>
                <Switch 
                  trackColor={{ false: "#e0e0e0", true: "#A5D6A7" }}
                  thumbColor={hasLongBreak ? "#4CAF50" : "#f4f3f4"}
                  onValueChange={setHasLongBreak}
                  value={hasLongBreak}
                />
              </View>

              {hasLongBreak && (
                <View style={styles.row}>
                  <View>
                    <Text style={styles.optionText}>Ciclos até o longo</Text>
                    <Text style={styles.subText}>Focos antes do descanso maior</Text>
                  </View>
                  {renderCounter(cycles, setCycles)}
                </View>
              )}

              <View style={styles.divider} />

              {/* --- LAYOUT VISUAL --- */}
              <View style={styles.sectionTitleWrap}>
                <Text style={styles.sectionTitle}>Tamanho do Bloco</Text>
              </View>

              <View style={styles.layoutGrid}>
                {renderLayoutOption(1, 1, '1 x 1')}
                {renderLayoutOption(2, 1, '2 x 1')}
                {renderLayoutOption(1, 2, '1 x 2')}
                {renderLayoutOption(2, 2, '2 x 2')}
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Salvar Alterações</Text>
              </TouchableOpacity>
              
              <View style={{ height: 40 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheetContainer: { backgroundColor: '#F9F9F9', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 12, maxHeight: '90%', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  header: { alignItems: 'center', marginBottom: 20 },
  dragHandle: { width: 40, height: 5, backgroundColor: '#CCC', borderRadius: 10, marginBottom: 15 },
  title: { fontSize: 20, fontWeight: '700', color: '#333' },
  content: { paddingBottom: 20 },
  sectionTitleWrap: { marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 },
  
  // Time Cards
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeCard: { backgroundColor: '#FFFFFF', paddingVertical: 15, borderRadius: 16, alignItems: 'center', width: '31%', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  disabledCard: { opacity: 0.4, backgroundColor: '#EEE' },
  timeInput: { fontSize: 28, fontWeight: '700', color: '#333', textAlign: 'center', width: '100%' }, // Aumentei um pouco a fonte
  label: { fontSize: 11, color: '#888', marginTop: 4, fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: '#E5E5E5', marginVertical: 20 },
  
  // Rows & Counters
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, marginBottom: 8 },
  optionText: { fontSize: 16, fontWeight: '600', color: '#333' },
  subText: { fontSize: 12, color: '#999', marginTop: 2 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#EEE' },
  counterIconBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 8 },
  iconText: { fontSize: 24, fontWeight: '500', color: '#555' },
  counterValue: { marginHorizontal: 12, fontSize: 16, fontWeight: 'bold', color: '#333', minWidth: 20, textAlign: 'center' },
  
  // Layout
  layoutGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 5,
  },
  layoutBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  layoutBtnSelected: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  iconContainer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  layoutBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  layoutBtnTextSelected: {
    color: '#FFF',
  },

  // Save Button
  saveButton: { backgroundColor: '#333', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 24 },
  saveText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});