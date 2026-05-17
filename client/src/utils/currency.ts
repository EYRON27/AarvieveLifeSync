export const CURRENCIES = [
  { code: 'PHP', label: '🇵🇭 Philippine Peso (₱)', symbol: '₱' },
  { code: 'USD', label: '🇺🇸 US Dollar ($)', symbol: '$' },
  { code: 'EUR', label: '🇪🇺 Euro (€)', symbol: '€' },
  { code: 'GBP', label: '🇬🇧 British Pound (£)', symbol: '£' },
  { code: 'JPY', label: '🇯🇵 Japanese Yen (¥)', symbol: '¥' },
  { code: 'KRW', label: '🇰🇷 Korean Won (₩)', symbol: '₩' },
  { code: 'AUD', label: '🇦🇺 Australian Dollar (A$)', symbol: 'A$' },
  { code: 'CAD', label: '🇨🇦 Canadian Dollar (C$)', symbol: 'C$' },
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  PHP: '₱', USD: '$', EUR: '€', GBP: '£', JPY: '¥', KRW: '₩', AUD: 'A$', CAD: 'C$'
};

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || '$';
  return `${symbol}${amount.toFixed(2)}`;
}
