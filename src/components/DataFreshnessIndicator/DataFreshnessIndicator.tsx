// src/components/DataFreshnessIndicator/DataFreshnessIndicator.tsx

import React, { memo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CacheMetadata } from '../../types/coin.types';
import { formatTimeAgo } from '../../utils/formatters';

interface DataFreshnessIndicatorProps {
  meta: CacheMetadata;
  isFetching: boolean;
  isError: boolean;
}

// ─── Ponto pulsante que indica fetch em andamento ──────────────────────────
function PulsingDot({ color }: { color: string }) {
  const opacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: color, opacity }]}
    />
  );
}

// ─── Dot estático para estados idle e erro ─────────────────────────────────
function StaticDot({ color }: { color: string }) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

export const DataFreshnessIndicator = memo(function DataFreshnessIndicator({
  meta,
  isFetching,
  isError,
}: DataFreshnessIndicatorProps) {
  // Atualiza o texto "X min atrás" a cada 30 segundos
  const [timeLabel, setTimeLabel] = useState(
    () => formatTimeAgo(meta.timestamp)
  );

  useEffect(() => {
    setTimeLabel(formatTimeAgo(meta.timestamp));
    const interval = setInterval(() => {
      setTimeLabel(formatTimeAgo(meta.timestamp));
    }, 30_000);
    return () => clearInterval(interval);
  }, [meta.timestamp]);

  // ─── Estados visuais ───────────────────────────────────────────────
  if (isFetching) {
    return (
      <View style={styles.container}>
        <PulsingDot color="#f7931a" />
        <Text style={styles.label}>Atualizando...</Text>
      </View>
    );
  }

  if (isError && meta.source === 'cache') {
    return (
      <View style={styles.container}>
        <StaticDot color="#ff4d4d" />
        <Text style={[styles.label, styles.errorLabel]}>
          Offline · {timeLabel}
        </Text>
      </View>
    );
  }

  if (meta.isStale) {
    return (
      <View style={styles.container}>
        <StaticDot color="#888" />
        <Text style={[styles.label, styles.staleLabel]}>
          Cache · {timeLabel}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StaticDot color="#00c896" />
      <Text style={[styles.label, styles.freshLabel]}>
        Ao vivo · {timeLabel}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  freshLabel: {
    color: '#00c896',
  },
  staleLabel: {
    color: '#888',
  },
  errorLabel: {
    color: '#ff4d4d',
  },
});