import { useHomeContext } from '../context/HomeContext';

export const useHome = () => {
  const context = useHomeContext();
  return context;
};