const moneyFormatter = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** "9999,00 PLN" – currency code after the amount, as in the design. */
export const formatPrice = (value: number, currency: string) => `${moneyFormatter.format(value)} ${currency}`

/** Polish plural forms: 1 produkt, 2 produkty, 5 produktów. */
export function pluralizeProducts(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (count === 1) return 'produkt'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'produkty'
  return 'produktów'
}

/**
 * Parses a numeric input, accepting both a comma and a dot.
 * `type="number"` rejects the comma unless the browser locale is Polish, so the
 * numeric fields are plain text inputs and the conversion happens here.
 */
export function parseDecimal(value: string): number | undefined {
  const normalized = value.replace(',', '.')
  if (normalized === '' || normalized === '-' || normalized === '.' || normalized === '-.') return undefined
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? undefined : parsed
}

/** Patterns accepted while typing (they allow "12," or a lone "-"). */
export const numericPattern = { decimal: /^-?\d*[.,]?\d*$/, integer: /^-?\d*$/ }
