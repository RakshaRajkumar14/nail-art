export const SITE_CURRENCY = 'EUR';

const euroFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: SITE_CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number) {
  return euroFormatter.format(Number(amount || 0));
}

export function formatStartingPrice(amount: number) {
  return `from ${formatCurrency(amount)}`;
}
