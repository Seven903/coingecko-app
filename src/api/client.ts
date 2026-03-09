// src/api/client.ts

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from './endpoints';
import { ApiError } from '../types/coin.types';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ponto de extensão: adicionar API Key aqui quando necessário
    // config.headers['x-cg-demo-api-key'] = process.env.EXPO_PUBLIC_API_KEY;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError): Promise<ApiError> => {
    const apiError: ApiError = {
      message: 'Erro desconhecido. Tente novamente.',
      status: error.response?.status,
    };

    if (error.code === 'ECONNABORTED') {
      apiError.message = 'Tempo de requisição esgotado. Verifique sua conexão.';
    } else if (!error.response) {
      apiError.message = 'Sem conexão com a internet.';
    } else {
      switch (error.response.status) {
        case 429:
          apiError.message = 'Limite de requisições atingido. Aguarde um momento.';
          break;
        case 404:
          apiError.message = 'Recurso não encontrado.';
          break;
        case 500:
          apiError.message = 'Erro interno do servidor CoinGecko.';
          break;
      }
    }

    return Promise.reject(apiError);
  }
);