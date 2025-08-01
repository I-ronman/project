

// project/IronmanView/src/contexts/RoutineContext.jsx

// 루틴 리스트를 전역 상태로 관리하는 방식으로 변경
// 1. 루틴 Context 생성 (RoutineContext.js)
import React, { createContext, useContext, useState } from 'react';

const RoutineContext = createContext();

export const useRoutine = () => useContext(RoutineContext);

export const RoutineProvider = ({ children }) => {
  const [savedRoutines, setSavedRoutines] = useState([]);

  const addRoutine = (routine) => {
    setSavedRoutines((prev) => [...prev, routine]);
  };

  const updateRoutine = (updated) => {
    setSavedRoutines((prev) => {
      const index = prev.findIndex((r) => r.name === updated.name);
      if (index !== -1) {
        const copy = [...prev];
        copy[index] = updated;
        return copy;
      }
      return [...prev, updated];
    });
  };

  const deleteRoutine = (name) => {
    setSavedRoutines((prev) => prev.filter((r) => r.name !== name));
  };

  return (
    <RoutineContext.Provider value={{ savedRoutines, addRoutine, updateRoutine, deleteRoutine }}>
      {children}
    </RoutineContext.Provider>
  );
};
