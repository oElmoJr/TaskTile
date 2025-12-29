import React, { createContext, useState, ReactNode } from 'react';

interface PomodoroContextData {
  pomodoroTime: number;
  setPomodoroTime: (time: number) => void;
  shortBreakTime: number;
  setShortBreakTime: (time: number) => void;
  longBreakTime: number;
  setLongBreakTime: (time: number) => void;
  cyclesCompleted: number;
  setCyclesCompleted: (cycles: number) => void;
}


export const PomodoroContext = createContext<PomodoroContextData>({} as PomodoroContextData);

interface PomodoroProviderProps {
  children: ReactNode;
}

export function PomodoroProvider({ children }: PomodoroProviderProps) {
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
      {children}
    </PomodoroContext.Provider>
  );
}