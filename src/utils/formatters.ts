/**
 * Format currency values
 */
export function formatCurrency(value: number, options: { compact?: boolean } = {}): string {
  const { compact = false } = options;
  
  if (compact && Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with appropriate suffixes
 */
export function formatNumber(value: number, options: { compact?: boolean } = {}): string {
  const { compact = false } = options;
  
  if (compact && Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Generate color palette for charts (colorblind-friendly)
 */
export function getChartColors(count: number): string[] {
  // Colorbrewer-inspired palette that's colorblind-friendly
  const colors = [
    '#2563eb', // Blue
    '#dc2626', // Red  
    '#16a34a', // Green
    '#d97706', // Orange
    '#7c3aed', // Purple
  ];
  
  return colors.slice(0, count);
}

/**
 * Calculate years from now for display
 */
export function getYearsFromNow(years: number): string {
  const currentYear = new Date().getFullYear();
  return `${currentYear + years}`;
}