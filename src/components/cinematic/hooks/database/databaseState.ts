
import { useState } from 'react';

export const useDatabaseState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    clearError
  };
};
