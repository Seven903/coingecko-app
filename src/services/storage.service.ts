// src/services/storage.service.ts — versão AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage é assíncrono mas o persister do TanStack
// aceita interface síncrona — usamos um wrapper com cache em memória
const memoryCache: Record<string, string> = {};

export const mmkvStorageAdapter = {
  getItem: (key: string): string | null => {
    return memoryCache[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    memoryCache[key] = value;
    // Persiste em background sem bloquear
    AsyncStorage.setItem(key, value).catch(() =>
      console.warn('[Storage] Falha ao persistir:', key)
    );
  },
  removeItem: (key: string): void => {
    delete memoryCache[key];
    AsyncStorage.removeItem(key).catch(() =>
      console.warn('[Storage] Falha ao remover:', key)
    );
  },
};

let lastUpdated: number | null = null;

export const cacheStorage = {
  setLastUpdated: (timestamp: number): void => {
    lastUpdated = timestamp;
    AsyncStorage.setItem('last_updated_coins', timestamp.toString()).catch(
      () => {}
    );
  },
  getLastUpdated: (): number | null => lastUpdated,
  clearAll: (): void => {
    Object.keys(memoryCache).forEach((k) => delete memoryCache[k]);
    AsyncStorage.clear().catch(() => {});
  },
};