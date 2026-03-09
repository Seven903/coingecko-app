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
import { SparklineChart } from '../SparklineChart';
import {
  formatPrice,
  formatCompactNumber,
  formatPercentage,
  getTrendColor,
} from '../../utils/formatters';

interface CoinCardProps {
  coin: Coin;
  onPress?: (coin: Coin) => void;
}

// ─── Sub-componente: Badge de variação ────────────────────────────────────
function ChangeBadge({ value }: { value: number }) {
  const color = getTrendColor(value);
  const arrow = value >= 0 ? '▲' : '▼';

  return (
    <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.badgeText, { color }]}>
        {arrow} {formatPercentage(Math.abs(value))}
      </Text>
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────
export const CoinCard = memo(function CoinCard({
  coin,
  onPress,
}: CoinCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(coin)}
      activeOpacity={0.75}
    >
      {/* ── Coluna esquerda: rank + avatar ── */}
      <View style={styles.leftSection}>
        <Text style={styles.rank}>#{coin.marketCap.rank}</Text>
        <Image
          source={{ uri: coin.image }}
          style={styles.avatar}
          resizeMode="contain"
        />
      </View>

      {/* ── Coluna central: nome + métricas ── */}
      <View style={styles.infoSection}>
        <Text style={styles.name} numberOfLines={1}>
          {coin.name}
        </Text>
        <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>

        <View style={styles.metricsRow}>
          <Text style={styles.metricLabel}>
            Vol:{' '}
            <Text style={styles.metricValue}>
              {formatCompactNumber(coin.volume.total24h)}
            </Text>
          </Text>
          <Text style={styles.metricSeparator}>·</Text>
          <Text style={styles.metricLabel}>
            MCap:{' '}
            <Text style={styles.metricValue}>
              {formatCompactNumber(coin.marketCap.value)}
            </Text>
          </Text>
        </View>
      </View>

      {/* ── Coluna direita: sparkline + preço + variação ── */}
      <View style={styles.rightSection}>
        <SparklineChart
          sparkline={coin.sparkline}
          width={72}
          height={32}
        />
        <Text style={styles.price}>
          {formatPrice(coin.price.current)}
        </Text>
        <ChangeBadge value={coin.price.changePercentage24h} />
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
    width: 44,
  },
  rank: {
    fontSize: 10,
    color: '#444',
    fontWeight: '600',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
  },
  infoSection: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  symbol: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#555',
  },
  metricValue: {
    color: '#888',
    fontWeight: '600',
  },
  metricSeparator: {
    fontSize: 10,
    color: '#333',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});