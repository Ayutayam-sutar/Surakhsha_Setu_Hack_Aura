import React, { createContext, useState, useCallback } from 'react';
import { TRAINING_MODULES as defaultModules } from '../constants';

export const TrainingContext = createContext(undefined);

const STORAGE_KEY = 'safehaven-training-progress';

export const TrainingProvider = ({ children }) => {
  const [modules, setModules] = useState(() => {
    try {
      const storedProgress = localStorage.getItem(STORAGE_KEY);
      if (storedProgress) {
        const progressMap = JSON.parse(storedProgress);
        // Merge stored progress with default module data to ensure titles, etc., are up-to-date
        return defaultModules.map(module => ({
          ...module,
          progress: progressMap[module.id] !== undefined ? progressMap[module.id] : module.progress,
        }));
      }
    } catch (e) {
      console.error("Error reading training progress from localStorage", e);
    }
    return defaultModules;
  });

  const updateModuleProgress = useCallback((moduleId, progress) => {
    setModules(currentModules => {
      const newModules = currentModules.map(module =>
        module.id === moduleId ? { ...module, progress } : module
      );
      
      // Persist to localStorage
      try {
        const progressMap = newModules.reduce((acc, module) => {
          acc[module.id] = module.progress;
          return acc;
        }, {});
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
      } catch (e) {
        console.error("Error saving training progress to localStorage", e);
      }
      return newModules;
    });
  }, []);

  return (
    <TrainingContext.Provider value={{ modules, updateModuleProgress }}>
      {children}
    </TrainingContext.Provider>
  );
};
