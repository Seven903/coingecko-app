// src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '../types/coin.types';

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isNetworkError' in error &&
    'isRateLimit' in error
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: (failureCount, error: unknown) => {
        if (isApiError(error)) {
          if (
            error.status === 404 ||
            error.status === 401 ||
            error.status === 403 ||
            error.isRateLimit
          ) {
            return false;
          }
        }
        return failureCount < 1;
      },
      refetchInterval: 1000 * 60,
      refetchIntervalInBackground: false,
    },
  },
});