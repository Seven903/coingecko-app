// src/components/CoinCard/CoinCard.tsx

import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Coin } from '../../types/coin.types';

interface CoinCardProps {
  coin: Coin;
  onPress?: (coin: Coin) => void;
}

function formatPrice(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  });
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function PriceChange({ value }: { value: number }) {
  const isPositive = value >= 0;
  const color = isPositive ? '#00c896' : '#ff4d4d';
  const arrow = isPositive ? '▲' : '▼';

  return (
    <Text style={[styles.priceChange, { color }]}>
      {arrow} {Math.abs(value).toFixed(2)}%
    </Text>
  );
}

export const CoinCard = memo(function CoinCard({
  coin,
  onPress,
}: CoinCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(coin)}
      activeOpacity={0.7}
    >
      {/* Rank + Avatar */}
      <View style={styles.leftSection}>
        <Text style={styles.rank}>#{coin.market_cap_rank}</Text>
        <Image
          source={{ uri: coin.image }}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>

      {/* Nome + Symbol */}
      <View style={styles.infoSection}>
        <Text style={styles.name} numberOfLines={1}>
          {coin.name}
        </Text>
        <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
        <Text style={styles.marketCap}>
          MCap: {formatMarketCap(coin.market_cap)}
        </Text>
      </View>

      {/* Preço + Variação */}
      <View style={styles.priceSection}>
        <Text style={styles.price}>{formatPrice(coin.current_price)}</Text>
        <PriceChange value={coin.price_change_percentage_24h} />
      </View>
    </TouchableOpacity>
  );
});


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    gap: 12,
  },
  leftSection: {
    alignItems: 'center',
    gap: 4,
    width: 48,
  },
  rank: {
    fontSize: 10,
    color: '#555',
    fontWeight: '600',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  infoSection: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  symbol: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  marketCap: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
  },
  priceSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  priceChange: {
    fontSize: 12,
    fontWeight: '600',
  },
});