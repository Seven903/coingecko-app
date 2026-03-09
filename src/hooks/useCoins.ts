// src/hooks/useCoins.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { fetchCoins, FetchCoinsParams } from '../api/coinsApi';
import { CoinsListResponse, ApiError } from '../types/coin.types';

// ─── Query Keys Factory ────────────────────────────────────────────────────
// Centraliza as keys — evita strings mágicas espalhadas pelo projeto
export const coinKeys = {
  all: ['coins'] as const,
  markets: (params: FetchCoinsParams) =>
    [...coinKeys.all, 'markets', params] as const,
};

// ─── Hook ──────────────────────────────────────────────────────────────────
export function useCoins(
  params: FetchCoinsParams = {}
): UseQueryResult<CoinsListResponse, ApiError> {
  return useQuery<CoinsListResponse, ApiError>({
    queryKey: coinKeys.markets(params),
    queryFn: () => fetchCoins(params),
  });
}