import { useContext } from 'react';
import { TrainingContext } from '../contexts/TrainingContext';

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};
