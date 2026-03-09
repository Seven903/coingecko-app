// src/api/coinsApi.ts

import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';
import { CoinGeckoRawCoin } from '../types/coin.types';
import { mapRawListToDomain } from '../utils/coinMapper';
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
  const { data } = await apiClient.get<CoinGeckoRawCoin[]>(
    ENDPOINTS.coins.markets,
    {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: true,              // ← ativado
        price_change_percentage: '24h',
        include_24hr_vol: true,       // ← volume explícito
      },
    }
  );

  // Transforma dado bruto da API → domínio interno tipado
  return mapRawListToDomain(data);
}
