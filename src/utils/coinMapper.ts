// src/utils/coinMapper.ts

import { Coin, CoinGeckoRawCoin, SparklineData } from '../types/coin.types';

function resolveSparklineTrend(prices: number[]): SparklineData['trend'] {
  if (prices.length < 2) return 'neutral';
  const first = prices[0];
  const last = prices[prices.length - 1];
  const delta = ((last - first) / first) * 100;
  if (delta > 1) return 'up';
  if (delta < -1) return 'down';
  return 'neutral';
}

export function mapRawCoinToDomain(raw: CoinGeckoRawCoin): Coin {
  const sparklinePrices = raw.sparkline_in_7d?.price ?? [];

  return {
    id: raw.id,
    symbol: raw.symbol,
    name: raw.name,
    image: raw.image,
    price: {
      current: raw.current_price,
      high24h: raw.high_24h,
      low24h: raw.low_24h,
      ath: raw.ath,
      atl: raw.atl,
      changePercentage24h: raw.price_change_percentage_24h,
      changeAbsolute24h: raw.price_change_24h,
    },
    volume: {
      total24h: raw.total_volume,
      fullyDilutedValuation: raw.fully_diluted_valuation,
    },
    marketCap: {
      value: raw.market_cap,
      rank: raw.market_cap_rank,
      dominancePercentage: null, // requer endpoint separado da CoinGecko
      changePercentage24h: raw.market_cap_change_percentage_24h,
    },
    sparkline: {
      prices: sparklinePrices,
      trend: resolveSparklineTrend(sparklinePrices),
    },
    lastUpdated: raw.last_updated,
  };
}

export function mapRawListToDomain(rawList: CoinGeckoRawCoin[]): Coin[] {
  return rawList.map(mapRawCoinToDomain);
}