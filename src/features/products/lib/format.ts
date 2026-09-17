const moneyFormatter = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** „9999,00 PLN” – zgodnie z projektem kod waluty po kwocie. */
export const formatPrice = (value: number, currency: string) => `${moneyFormatter.format(value)} ${currency}`

/** Polska odmiana: 1 produkt, 2 produkty, 5 produktów. */
export function pluralizeProducts(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (count === 1) return 'produkt'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'produkty'
  return 'produktów'
}

/**
 * Zamienia tekst z pola liczbowego na liczbę, akceptując przecinek i kropkę.
 * Pole `type="number"` odrzuca przecinek, gdy przeglądarka ma lokalizację inną niż polska,
 * dlatego pola liczbowe są tekstowe, a konwersję robimy tutaj.
 */
export function parseDecimal(value: string): number | undefined {
  const normalized = value.replace(',', '.')
  if (normalized === '' || normalized === '-' || normalized === '.' || normalized === '-.') return undefined
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? undefined : parsed
}

/** Wzorce dopuszczalnego tekstu w trakcie pisania (pozwalają na „12,” albo samo „-”). */
export const numericPattern = { decimal: /^-?\d*[.,]?\d*$/, integer: /^-?\d*$/ }
