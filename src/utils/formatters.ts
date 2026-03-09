// src/utils/formatters.ts

// ─── Preço ─────────────────────────────────────────────────────────────────
export function formatPrice(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (value >= 1) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  // Moedas fracionadas (ex: SHIB, PEPE)
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 6,
    maximumFractionDigits: 8,
  });
}

// ─── Market Cap / Volume ───────────────────────────────────────────────────
export function formatCompactNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9)  return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6)  return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString('en-US')}`;
}

// ─── Variação percentual ───────────────────────────────────────────────────
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// ─── Tempo decorrido (para DataFreshness) ─────────────────────────────────
export function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 10)  return 'agora mesmo';
  if (diffSec < 60)  return `${diffSec}s atrás`;
  if (diffMin < 60)  return `${diffMin}min atrás`;
  if (diffHour < 24) return `${diffHour}h atrás`;
  return 'mais de 1 dia atrás';
}

// ─── Cor de tendência ──────────────────────────────────────────────────────
export const TREND_COLORS = {
  up:      '#00c896',
  down:    '#ff4d4d',
  neutral: '#888888',
} as const;

export function getTrendColor(value: number): string {
  if (value > 0) return TREND_COLORS.up;
  if (value < 0) return TREND_COLORS.down;
  return TREND_COLORS.neutral;
}