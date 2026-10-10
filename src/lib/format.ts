export const CURRENCY_SYMBOL: string = '$';

export function formatMoney(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const digits = String(Math.abs(rounded));
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}${CURRENCY_SYMBOL}${withCommas}`;
}