// src/types/coin.types.ts

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export type CoinsListResponse = Coin[];