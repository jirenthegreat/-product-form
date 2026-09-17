import { describe, expect, it } from 'vitest'

import { parseDecimal } from './format'
import { grossToNet, netToGross, roundMoney } from './price'

describe('price', () => {
  it('przelicza netto na brutto', () => {
    expect(netToGross(100, 23)).toBe(123)
    expect(netToGross(8129.27, 23)).toBe(9999)
    expect(netToGross(10, 0)).toBe(10)
  })

  it('przelicza brutto na netto', () => {
    expect(grossToNet(123, 23)).toBe(100)
    expect(grossToNet(108, 8)).toBe(100)
  })

  it('zwraca undefined dla pustej wartości', () => {
    expect(netToGross(undefined, 23)).toBeUndefined()
    expect(grossToNet(Number.NaN, 23)).toBeUndefined()
  })

  it('zaokrąglaja do groszy', () => {
    expect(roundMoney(1.005)).toBe(1.01)
    expect(netToGross(0.1, 23)).toBe(0.12)
  })
})

describe('parseDecimal', () => {
  it('akceptuje przecinek i kropkę', () => {
    expect(parseDecimal('12,5')).toBe(12.5)
    expect(parseDecimal('12.5')).toBe(12.5)
    expect(parseDecimal('1234')).toBe(1234)
  })

  it('zwraca undefined dla wartości niepełnych lub pustych', () => {
    expect(parseDecimal('')).toBeUndefined()
    expect(parseDecimal('-')).toBeUndefined()
    expect(parseDecimal('.')).toBeUndefined()
  })

  it('traktuje „12,” jak 12 (użytkownik jest w trakcie pisania)', () => {
    expect(parseDecimal('12,')).toBe(12)
  })
})
