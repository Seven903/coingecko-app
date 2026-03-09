// src/components/SparklineChart/SparklineChart.tsx

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Polyline, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { TREND_COLORS } from '../../utils/formatters';
import type { SparklineData } from '../../types/coin.types';

interface SparklineChartProps {
  sparkline: SparklineData;
  width?: number;
  height?: number;
}

// Normaliza array de preços para coordenadas SVG
function normalizePrices(
  prices: number[],
  width: number,
  height: number,
  padding: number = 4
): string {
  if (prices.length < 2) return '';

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;

  return prices
    .map((price, index) => {
      const x = padding + (index / (prices.length - 1)) * availableWidth;
      const y = padding + (1 - (price - min) / range) * availableHeight;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

// Downsampling: reduz pontos para performance no FlatList
function downsample(prices: number[], targetPoints: number = 30): number[] {
  if (prices.length <= targetPoints) return prices;
  const step = Math.floor(prices.length / targetPoints);
  return prices.filter((_, index) => index % step === 0);
}

export const SparklineChart = memo(function SparklineChart({
  sparkline,
  width = 80,
  height = 40,
}: SparklineChartProps) {
  const { prices, trend } = sparkline;
  const color = TREND_COLORS[trend];

  if (prices.length < 2) {
    return <View style={[styles.container, { width, height }]} />;
  }

  const sampledPrices = downsample(prices);
  const points = normalizePrices(sampledPrices, width, height);
  const gradientId = `grad-${trend}`;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.25" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Área de gradiente abaixo da linha */}
        <Rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill={`url(#${gradientId})`}
        />

        {/* Linha do sparkline */}
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 4,
  },
});