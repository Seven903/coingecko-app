// src/types/coin.types.ts

// ─── Domínio: Preço ────────────────────────────────────────────────────────
export interface PriceData {
  current: number;
  high24h: number;
  low24h: number;
  ath: number;
  atl: number;
  changePercentage24h: number;
  changeAbsolute24h: number;
}

// ─── Domínio: Volume ───────────────────────────────────────────────────────
export interface VolumeData {
  total24h: number;
  fullyDilutedValuation: number | null;
}

// ─── Domínio: Market Cap ───────────────────────────────────────────────────
export interface MarketCapData {
  value: number;
  rank: number;
  dominancePercentage: number | null;
  changePercentage24h: number;
}

// ─── Domínio: Sparkline ────────────────────────────────────────────────────
export interface SparklineData {
  prices: number[]; // 7 dias de preços horários (~168 pontos)
  trend: 'up' | 'down' | 'neutral';
}

// ─── Model Principal ───────────────────────────────────────────────────────
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: PriceData;
  volume: VolumeData;
  marketCap: MarketCapData;
  sparkline: SparklineData;
  lastUpdated: string; // ISO 8601
}

// ─── Contrato bruto da API (CoinGecko) ────────────────────────────────────
// Separado do Model para isolar a variação da API do domínio interno
export interface CoinGeckoRawCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  market_cap_change_percentage_24h: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  ath: number;
  atl: number;
  last_updated: string;
  sparkline_in_7d: {
    price: number[];
  } | null;
}

// ─── Tipos auxiliares ──────────────────────────────────────────────────────
export type CoinsListResponse = Coin[];

export interface ApiError {
  message: string;
  status?: number;
  isNetworkError: boolean;
  isRateLimit: boolean;
  retryAfter?: number; // segundos — vindo do header Retry-After
}

export interface CacheMetadata {
  timestamp: number;      // Unix ms da última atualização
  isStale: boolean;       // dado veio do cache sem revalidação?
  source: 'network' | 'cache';
}

export interface CoinsWithMeta {
  coins: Coin[];
  meta: CacheMetadata;
}