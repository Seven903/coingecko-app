// src/api/coinsApi.ts

import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { CoinsListResponse } from '../types/coin.types';

export interface FetchCoinsParams {
  currency?: string;
  perPage?: number;
  page?: number;
}

export async function fetchCoins({
  currency = 'usd',
  perPage = 20,
  page = 1,
}: FetchCoinsParams = {}): Promise<CoinsListResponse> {
  const { data } = await apiClient.get<CoinsListResponse>(
    ENDPOINTS.coins.markets,
    {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: false,
        price_change_percentage: '24h',
      },
    }
  );

  return data;
}