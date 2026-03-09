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
import { DataFreshnessIndicator } from '../../components/DataFreshnessIndicator';
import { Coin } from '../../types/coin.types';

export function MarketScreen() {
  const {
    coins,
    meta,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useCoins({ perPage: 20 });

  const handleCoinPress = useCallback((coin: Coin) => {
    // Ponto de extensão: navegação para DetailScreen
    console.log(`[Nav] → ${coin.id}`);
  }, []);

  const renderCoin: ListRenderItem<Coin> = useCallback(
    ({ item }) => <CoinCard coin={item} onPress={handleCoinPress} />,
    [handleCoinPress]
  );

  const keyExtractor = useCallback((item: Coin) => item.id, []);

  // ─── Loading apenas quando não há nenhum dado ─────────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header meta={null} isFetching={false} isError={false} />
        <LoadingSkeleton count={12} />
      </SafeAreaView>
    );
  }

  // ─── Erro sem cache disponível ────────────────────────────────────
  if (isError && coins.length === 0 && error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header meta={null} isFetching={false} isError={true} />
        <ErrorFallback error={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header meta={meta} isFetching={isFetching} isError={isError} />
      <FlatList
        data={coins}
        keyExtractor={keyExtractor}
        renderItem={renderCoin}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        // Otimizações de performance para listas financeiras
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={10}
        initialNumToRender={10}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
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

// ─── Header com DataFreshnessIndicator ────────────────────────────────────
interface HeaderProps {
  meta: ReturnType<typeof useCoins>['meta'] | null;
  isFetching: boolean;
  isError: boolean;
}

function Header({ meta, isFetching, isError }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Mercado</Text>
        <Text style={styles.headerSubtitle}>Top moedas por market cap</Text>
      </View>
      {meta && (
        <DataFreshnessIndicator
          meta={meta}
          isFetching={isFetching}
          isError={isError}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  list: {
    paddingBottom: 40,
  },
  emptyText: {
    color: '#555',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 14,
  },
});
