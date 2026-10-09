export const CURRENCY_SYMBOL: string = '$';

export function formatMoney(amount: number): string {
  return CURRENCY_SYMBOL + amount.toLocaleString('en-US');
}
