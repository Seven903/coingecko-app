// src/components/ErrorFallback/ErrorFallback.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ApiError } from '../../types/coin.types';

interface ErrorFallbackProps {
  error: ApiError;
  onRetry: () => void;
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>{error.message}</Text>
      {error.status && (
        <Text style={styles.status}>Código: {error.status}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={onRetry}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 20,
  },
  status: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#f7931a',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});