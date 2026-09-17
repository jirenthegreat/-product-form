export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100

const isFiniteNumber = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value)

/** brutto = netto × (1 + VAT / 100) */
export function netToGross(net: number | undefined, vatRate: number): number | undefined {
  return isFiniteNumber(net) ? roundMoney(net * (1 + vatRate / 100)) : undefined
}

/** netto = brutto / (1 + VAT / 100) */
export function grossToNet(gross: number | undefined, vatRate: number): number | undefined {
  return isFiniteNumber(gross) ? roundMoney(gross / (1 + vatRate / 100)) : undefined
}
