// src/providers/QueryProvider.tsx

import React, { type ReactNode } from 'react';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient } from '../lib/queryClient';
import { mmkvPersister } from '../lib/persister';
import { cacheStorage } from '../services/storage.service';

interface QueryProviderProps {
  children: ReactNode;
}

// Movido para fora — executado uma vez quando o cache é restaurado
function handleCacheRestored() {
  const lastUpdated = cacheStorage.getLastUpdated();
  if (lastUpdated) {
    console.info(
      `[Cache] Restaurado. Última atualização: ${new Date(lastUpdated).toLocaleTimeString()}`
    );
  }
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: mmkvPersister,
        maxAge: 1000 * 60 * 60 * 24,
      }}
      onSuccess={handleCacheRestored}  // ← prop direta, não dentro de persistOptions
    >
      {children}
    </PersistQueryClientProvider>
  );
}