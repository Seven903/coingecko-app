// src/components/LoadingSkeleton/LoadingSkeleton.tsx

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

function SkeletonRow() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.row, { opacity }]}>
      {/* Avatar */}
      <View style={styles.avatar} />
      {/* Info block */}
      <View style={styles.infoBlock}>
        <View style={styles.lineShort} />
        <View style={styles.lineLong} />
      </View>
      {/* Price block */}
      <View style={styles.priceBlock}>
        <View style={styles.lineMedium} />
        <View style={styles.lineShort} />
      </View>
    </Animated.View>
  );
}

interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 10 }: LoadingSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </View>
  );
}

const SKELETON_COLOR = '#2a2a2a';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: SKELETON_COLOR,
  },
  infoBlock: {
    flex: 1,
    gap: 8,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 8,
  },
  lineShort: {
    height: 12,
    width: 60,
    borderRadius: 6,
    backgroundColor: SKELETON_COLOR,
  },
  lineLong: {
    height: 10,
    width: 100,
    borderRadius: 5,
    backgroundColor: SKELETON_COLOR,
  },
  lineMedium: {
    height: 12,
    width: 80,
    borderRadius: 6,
    backgroundColor: SKELETON_COLOR,
  },
}); 