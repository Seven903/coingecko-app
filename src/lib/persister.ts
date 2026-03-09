// src/lib/persister.ts

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { mmkvStorageAdapter } from '../services/storage.service';

export const mmkvPersister = createSyncStoragePersister({
  storage: mmkvStorageAdapter,
  key: 'COINGECKO_QUERY_CACHE',
  throttleTime: 1000,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});