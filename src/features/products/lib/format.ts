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

/** Pusty input liczbowy → `undefined`, w przeciwnym razie liczba. */
export function parseNumberInput(event: React.ChangeEvent<HTMLInputElement>): number | undefined {
  if (event.target.value === '') return undefined
  const value = event.target.valueAsNumber
  return Number.isNaN(value) ? undefined : value
}
