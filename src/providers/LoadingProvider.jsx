import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ProgressSpinner } from 'primereact/progressspinner';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [operations, setOperations] = useState({});
  const [manualLoading, setManualLoading] = useState(false);

  const startLoading = useCallback((key = 'default') => {
    setOperations((current) => ({
      ...current,
      [key]: (current[key] || 0) + 1,
    }));
  }, []);

  const stopLoading = useCallback((key = 'default') => {
    setOperations((current) => {
      const count = current[key] || 0;

      if (count <= 1) {
        const next = { ...current };
        delete next[key];
        return next;
      }

      return {
        ...current,
        [key]: count - 1,
      };
    });
  }, []);

  const withLoading = useCallback(
    async (task, key = 'default') => {
      startLoading(key);

      try {
        return await task();
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading]
  );

  const isLoading =
    manualLoading || Object.keys(operations).length > 0;

  const contextValue = useMemo(
    () => ({
      isLoading,
      startLoading,
      stopLoading,
      withLoading,
      setLoading: setManualLoading,
    }),
    [
      isLoading,
      startLoading,
      stopLoading,
      withLoading,
    ]
  );

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}

      {isLoading && (
        <div
          className="homedeck-loading-overlay"
          role="status"
          aria-live="polite"
          aria-label="Carregando"
        >
          <div className="homedeck-loading-content">
            <ProgressSpinner
              strokeWidth="4"
              style={{ width: '56px', height: '56px' }}
            />

            <span>Preparando o HomeDeck...</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error(
      'useLoading deve ser utilizado dentro de LoadingProvider.'
    );
  }

  return context;
}