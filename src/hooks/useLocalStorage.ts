import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    } catch (error) {
      console.error('Error setting localStorage key:', key, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Example usage (remove or replace with actual usage in your component)
// setTasks(prev => [newTask, ...prev]);
// setTasks(prev => prev.map(...));
// setTasks(prev => prev.filter(...));