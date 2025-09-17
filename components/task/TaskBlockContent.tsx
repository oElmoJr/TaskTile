import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskBlockContent = () => {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Estudar para a prova', completed: false },
    { id: '2', text: 'Terminar o projeto', completed: false },
    { id: '3', text: 'Fazer o exercício', completed: true },
  ]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const renderItem = (props: any) => (
    <View style={taskStyles.taskItem}>
      <TouchableOpacity
        style={taskStyles.taskCheckbox}
        onPress={() => toggleTask(props.id)}
      >
        <View
          style={[
            taskStyles.checkbox,
            props.completed && taskStyles.checkboxCompleted,
          ]}
        >
          {props.completed && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
      </TouchableOpacity>
      <Text style={[taskStyles.taskText, props.completed && taskStyles.taskTextCompleted]}>
        {props.text}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={taskStyles.header}>
        <Text style={taskStyles.taskTitle}>Tasks</Text>
        <TouchableOpacity style={taskStyles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={taskStyles.taskList}
      />
    </View>
  );
};

const taskStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    marginTop: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  taskCheckbox: {
    padding: 5,
    marginRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#333',
  },
  taskText: {
    fontSize: 16,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});

export default TaskBlockContent;