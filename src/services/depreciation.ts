import { Asset, DepreciationDetails } from '../types/asset';

const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  THB: 1.0,
  USD: 34.5,
  EUR: 37.2,
  JPY: 0.23,
};

/**
 * Compute precise age in years from receivedDate to target date (or today)
 */
export function calculateAgeInYears(receivedDateStr: string, targetDate: Date = new Date()): number {
  if (!receivedDateStr) return 0;
  const received = new Date(receivedDateStr);
  if (isNaN(received.getTime())) return 0;

  const diffTime = Math.max(0, targetDate.getTime() - received.getTime());
  const diffDays = diffTime / (1000 * 3600 * 24);
  const years = diffDays / 365.25;
  return Math.round(years * 10) / 10; // 1 decimal place
}

/**
 * Convert cost to THB based on currency
 */
export function convertToThb(invCost: number, currency: string, rateOverride?: number): number {
  const rate = rateOverride || DEFAULT_EXCHANGE_RATES[currency] || 1.0;
  return Math.round(invCost * rate * 100) / 100;
}

/**
 * Calculate 7-Year Straight Line Depreciation according to Hana QM Asset standard rules
 */
export function calculateDepreciation(
  amountThb: number,
  receivedDateStr: string,
  usefulLifeYears: number = 7,
  overrideBookValueThb: number | null = null
): DepreciationDetails {
  const ageYears = calculateAgeInYears(receivedDateStr);
  const safeLife = usefulLifeYears > 0 ? usefulLifeYears : 7;
  const annualDepreciation = amountThb > 0 ? amountThb / safeLife : 0;

  const rawAccumulated = annualDepreciation * ageYears;
  const calculatedAccumulated = Math.min(amountThb, Math.max(0, rawAccumulated));
  const calculatedBookValue = Math.max(0, amountThb - calculatedAccumulated);

  const currentBookValueThb = overrideBookValueThb !== null ? overrideBookValueThb : calculatedBookValue;
  const accumulatedDepreciationThb = overrideBookValueThb !== null
    ? Math.max(0, amountThb - overrideBookValueThb)
    : calculatedAccumulated;

  const isFullyDepreciated = ageYears >= safeLife || currentBookValueThb === 0;
  const remainingLifeYears = Math.max(0, Math.round((safeLife - ageYears) * 10) / 10);

  return {
    originalCostThb: Math.round(amountThb * 100) / 100,
    usefulLifeYears: safeLife,
    ageYears,
    accumulatedDepreciationThb: Math.round(accumulatedDepreciationThb * 100) / 100,
    currentBookValueThb: Math.round(currentBookValueThb * 100) / 100,
    annualDepreciationThb: Math.round(annualDepreciation * 100) / 100,
    isFullyDepreciated,
    remainingLifeYears,
  };
}

/**
 * Format currency number into readable Thai Baht format
 */
export function formatCurrency(amount: number | null | undefined, currency: string = 'THB'): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'N/A';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: currency === 'THB' ? 'THB' : currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
