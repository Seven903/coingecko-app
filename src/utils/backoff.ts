// src/utils/backoff.ts

export interface BackoffOptions {
  baseDelay?: number;    // delay inicial em ms (default: 500)
  maxDelay?: number;     // delay máximo em ms (default: 30000)
  maxRetries?: number;   // tentativas máximas (default: 4)
  jitter?: boolean;      // adiciona ruído aleatório (default: true)
}

export interface BackoffResult {
  shouldRetry: boolean;
  delayMs: number;
  attempt: number;
}

// Calcula o delay para a tentativa N com jitter opcional
// Fórmula: min(baseDelay * 2^attempt + jitter, maxDelay)
export function calculateBackoff(
  attempt: number,
  options: BackoffOptions = {}
): BackoffResult {
  const {
    baseDelay = 500,
    maxDelay = 30000,
    maxRetries = 4,
    jitter = true,
  } = options;

  const shouldRetry = attempt < maxRetries;

  if (!shouldRetry) {
    return { shouldRetry: false, delayMs: 0, attempt };
  }

  const exponential = baseDelay * Math.pow(2, attempt);
  const noise = jitter ? Math.random() * baseDelay : 0;
  const delayMs = Math.min(exponential + noise, maxDelay);

  return {
    shouldRetry: true,
    delayMs: Math.round(delayMs),
    attempt,
  };
}

// Promise que resolve após o delay calculado
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Tabela de referência dos delays (sem jitter):
// Attempt 0: 500ms
// Attempt 1: 1000ms
// Attempt 2: 2000ms
// Attempt 3: 4000ms
// Attempt 4: STOP (maxRetries atingido)