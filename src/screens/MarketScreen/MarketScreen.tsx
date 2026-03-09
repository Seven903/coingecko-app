// src/screens/MarketScreen/MarketScreen.tsx

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { useCoins } from '../../hooks/useCoins';
import { CoinCard } from '../../components/CoinCard';
import { ErrorFallback } from '../../components/ErrorFallback';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Coin } from '../../types/coin.types';

const COINS_PER_PAGE = 20;

export function MarketScreen() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCoins({ perPage: COINS_PER_PAGE });

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleCoinPress = useCallback((coin: Coin) => {
    // Ponto de extensão: navegação para DetailScreen no futuro
    console.log(`Navegando para: ${coin.id}`);
  }, []);

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  // ─── Render Item ──────────────────────────────────────────────────────
  const renderCoin: ListRenderItem<Coin> = useCallback(
    ({ item }) => (
      <CoinCard coin={item} onPress={handleCoinPress} />
    ),
    [handleCoinPress]
  );

  const keyExtractor = useCallback((item: Coin) => item.id, []);

  // ─── Estados de UI ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <LoadingSkeleton count={COINS_PER_PAGE} />
      </SafeAreaView>
    );
  }

  if (isError && error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <ErrorFallback error={error} onRetry={handleRefetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderCoin}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefetch}
            tintColor="#f7931a"
            colors={['#f7931a']}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma moeda encontrada.</Text>
        }
      />
    </SafeAreaView>
  );
}

// ─── Sub-componente Header ─────────────────────────────────────────────────
function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Mercado</Text>
      <Text style={styles.headerSubtitle}>Top moedas por market cap</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  list: {
    paddingBottom: 32,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 14,
  },
});