// src/hooks/useCoins.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCoins, FetchCoinsParams } from '../api/coinsApi';
import { CoinsListResponse, ApiError, CacheMetadata } from '../types/coin.types';
import { cacheStorage } from '../services/storage.service';

// ─── Query Keys Factory ────────────────────────────────────────────────────
export const coinKeys = {
  all: ['coins'] as const,
  markets: (params: FetchCoinsParams) =>
    [...coinKeys.all, 'markets', params] as const,
};

// ─── Tipos de retorno ──────────────────────────────────────────────────────
export interface UseCoinsReturn {
  coins: CoinsListResponse;
  meta: CacheMetadata;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  error: ApiError | null;
  refetch: () => void;
}

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useCoins(params: FetchCoinsParams = {}): UseCoinsReturn {
  const queryClient = useQueryClient();

  const query = useQuery<CoinsListResponse, ApiError>({
    queryKey: coinKeys.markets(params),
    queryFn: async () => {
      const data = await fetchCoins(params);

      // Persiste o timestamp de atualização real (dado veio da rede)
      cacheStorage.setLastUpdated(Date.now());

      return data;
    },
    placeholderData: (previousData) => previousData, // mantém dado anterior durante refetch
  });

  // ─── Resolve metadata de origem do dado ─────────────────────────────
  const lastUpdatedTimestamp = cacheStorage.getLastUpdated();
  const queryState = queryClient.getQueryState(coinKeys.markets(params));

  const meta: CacheMetadata = {
    timestamp: lastUpdatedTimestamp ?? Date.now(),
    isStale: query.isStale,
    source: query.isFetching ? 'network' : 'cache',
  };

  return {
    coins: query.data ?? [],
    meta,
    isLoading: query.isLoading && !query.data, // true APENAS se não há dado nenhum
    isError: query.isError,
    isFetching: query.isFetching,              // true durante revalidação silenciosa
    error: query.error ?? null,
    refetch: query.refetch,
  };
}