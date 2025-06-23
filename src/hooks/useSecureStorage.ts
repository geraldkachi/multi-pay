import { useState, useEffect } from 'react';
import { secureStorage } from '@/lib/secureStorage';
import { validateAndSanitizeJsonData } from '@/lib/dataValidation';

/**
 * Hook for secure storage with encryption and validation
 */
export function useSecureStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await secureStorage.getItem(key);
        if (storedValue !== null) {
          const parsed = JSON.parse(storedValue);
          const sanitized = validateAndSanitizeJsonData(parsed);
          setValue(sanitized);
        }
      } catch (err) {
        console.error(`Error loading secure storage for key ${key}:`, err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const setSecureValue = async (newValue: T) => {
    try {
      setError(null);
      const sanitized = validateAndSanitizeJsonData(newValue);
      await secureStorage.setItem(key, JSON.stringify(sanitized));
      setValue(sanitized);
    } catch (err) {
      console.error(`Error saving secure storage for key ${key}:`, err);
      setError('Failed to save data');
      throw err;
    }
  };

  const removeValue = () => {
    secureStorage.removeItem(key);
    setValue(defaultValue);
  };

  return {
    value,
    setValue: setSecureValue,
    removeValue,
    loading,
    error
  };
}