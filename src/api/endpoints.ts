// src/api/endpoints.ts

export const BASE_URL = 'https://api.coingecko.com/api/v3';

export const ENDPOINTS = {
  coins: {
    markets: '/coins/markets',
  },
} as const;