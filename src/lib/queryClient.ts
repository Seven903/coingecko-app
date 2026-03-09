// src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../types/coin.types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,        // dados frescos por 2 minutos
      gcTime: 1000 * 60 * 10,          // cache mantido por 10 minutos
      refetchOnWindowFocus: false,      // evita refetch desnecessário em mobile
      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        // Não tenta novamente em erro 429 (rate limit) ou 404
        if (apiError.status === 429 || apiError.status === 404) return false;
        return failureCount < 2;        // máximo 2 tentativas nos demais erros
      },
    },
  },
});