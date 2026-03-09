// src/api/client.ts

import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { BASE_URL } from './endpoints';
import { ApiError } from '../types/coin.types';
import { calculateBackoff, waitFor } from '../utils/backoff';

// ─── Normaliza qualquer erro Axios em ApiError tipado ──────────────────────
function normalizeError(error: AxiosError): ApiError {
  const status = error.response?.status;
  const retryAfterHeader = error.response?.headers?.['retry-after'];

  const base: ApiError = {
    message: 'Erro desconhecido. Tente novamente.',
    isNetworkError: false,
    isRateLimit: false,
    status,
  };

  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
    return {
      ...base,
      message: 'Sem conexão com a internet.',
      isNetworkError: true,
    };
  }

  if (!error.response) {
    return {
      ...base,
      message: 'Servidor inacessível. Verifique sua conexão.',
      isNetworkError: true,
    };
  }

  switch (status) {
    case 429:
      return {
        ...base,
        message: 'Limite de requisições atingido.',
        isRateLimit: true,
        retryAfter: retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60,
      };
    case 500:
    case 502:
    case 503:
      return {
        ...base,
        message: 'Servidor CoinGecko instável. Tentando novamente...',
      };
    case 404:
      return { ...base, message: 'Recurso não encontrado.' };
    default:
      return { ...base, message: `Erro inesperado (${status}).` };
  }
}

// ─── Cria instância com backoff automático ─────────────────────────────────
function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 12000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // ── Request Interceptor ──────────────────────────────────────────────
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Ponto de extensão: injetar API Key quando migrar para plano Pro
      // config.headers['x-cg-demo-api-key'] = process.env.EXPO_PUBLIC_CG_KEY;
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // ── Response Interceptor com Exponential Backoff ─────────────────────
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError): Promise<AxiosResponse> => {
      const config = error.config as InternalAxiosRequestConfig & {
        _attempt?: number;
      };

      // Inicializa contador de tentativas na config da requisição
      if (config._attempt === undefined) config._attempt = 0;

      const apiError = normalizeError(error);
      const { status } = apiError;

      // Erros que NÃO devem ser retentados
      const isNonRetryable =
        status === 404 ||
        status === 401 ||
        status === 403;

      if (isNonRetryable) {
        return Promise.reject(apiError);
      }

      // Rate limit: respeita o Retry-After da API antes de tentar novamente
      if (apiError.isRateLimit && apiError.retryAfter) {
        const waitMs = apiError.retryAfter * 1000;
        console.warn(`[API] Rate limit. Aguardando ${apiError.retryAfter}s...`);
        await waitFor(waitMs);
        config._attempt = 0; // reseta contador após espera do rate limit
        return instance.request(config);
      }

      // Erros de rede e 5xx: aplica backoff exponencial
      const backoff = calculateBackoff(config._attempt, {
        baseDelay: 600,
        maxDelay: 20000,
        maxRetries: 3,
      });

      if (!backoff.shouldRetry) {
        return Promise.reject(apiError);
      }

      config._attempt += 1;
      console.warn(
        `[API] Tentativa ${config._attempt} em ${backoff.delayMs}ms...`
      );

      await waitFor(backoff.delayMs);
      return instance.request(config);
    }
  );

  return instance;
}

export const apiClient = createApiClient();