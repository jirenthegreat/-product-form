import { describe, expect, it } from 'vitest'

import { availabilitySchema, basicInfoSchema, pricingSchema } from './product-schema'

const messagesFor = (result: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }, key: string) =>
  result.error?.issues.filter((i) => i.path[0] === key).map((i) => i.message) ?? []

const validBasic = {
  name: 'MacBook',
  sku: 'MBP14',
  description: '',
  manufacturer: 'Apple',
  category: 'Komputery',
  features: ['WiFi'],
}

describe('basicInfoSchema', () => {
  it('akceptuje poprawne dane', () => {
    expect(basicInfoSchema.safeParse(validBasic).success).toBe(true)
  })

  it('wymaga nazwy o długości min. 3 znaków', () => {
    expect(messagesFor(basicInfoSchema.safeParse({ ...validBasic, name: 'ab' }), 'name')).toContain(
      'Nazwa musi mieć co najmniej 3 znaki',
    )
  })

  it.each(['ABC-123', 'abc 1', 'żółw1'])('odrzuca SKU ze znakami specjalnymi: %s', (sku) => {
    expect(basicInfoSchema.safeParse({ ...validBasic, sku }).success).toBe(false)
  })

  it('odrzuca SKU dłuższe niż 24 znaki', () => {
    expect(basicInfoSchema.safeParse({ ...validBasic, sku: 'A'.repeat(25) }).success).toBe(false)
    expect(basicInfoSchema.safeParse({ ...validBasic, sku: 'A'.repeat(24) }).success).toBe(true)
  })

  it('wymaga producenta, kategorii i co najmniej jednej cechy', () => {
    const result = basicInfoSchema.safeParse({ ...validBasic, manufacturer: '', category: 'X', features: [] })
    expect(messagesFor(result, 'manufacturer')).toEqual(['Wybierz producenta'])
    expect(messagesFor(result, 'category')).toEqual(['Wybierz kategorię'])
    expect(messagesFor(result, 'features')).toEqual(['Wybierz co najmniej jedną cechę'])
  })
})

describe('pricingSchema', () => {
  it('wymaga cen', () => {
    const result = pricingSchema.safeParse({ netPrice: undefined, grossPrice: undefined, vatRate: 23, currency: 'PLN' })
    expect(messagesFor(result, 'netPrice')).toEqual(['Cena netto jest wymagana'])
  })
})

const validAvailability = { isAvailable: true, isLimited: false, stock: undefined, minCartQty: 1, maxCartQty: 10 }

describe('availabilitySchema', () => {
  it('nie wymaga stanu magazynowego, gdy produkt nie jest limitowany', () => {
    expect(availabilitySchema.safeParse(validAvailability).success).toBe(true)
  })

  it('wymaga nieujemnej, całkowitej ilości, gdy produkt jest limitowany', () => {
    const base = { ...validAvailability, isLimited: true }
    expect(messagesFor(availabilitySchema.safeParse(base), 'stock')).toEqual(['Podaj ilość na magazynie'])
    expect(messagesFor(availabilitySchema.safeParse({ ...base, stock: -1 }), 'stock')).toEqual(['Ilość nie może być ujemna'])
    expect(messagesFor(availabilitySchema.safeParse({ ...base, stock: 1.5 }), 'stock')).toEqual([
      'Wartość musi być liczbą całkowitą',
    ])
    expect(availabilitySchema.safeParse({ ...base, stock: 0 }).success).toBe(true)
  })

  it('pokazuje błąd stanu magazynowego nawet gdy inne pola są niepoprawne', () => {
    const result = availabilitySchema.safeParse({ ...validAvailability, isLimited: true, minCartQty: undefined })
    expect(messagesFor(result, 'stock')).toHaveLength(1)
  })

  it('pilnuje, aby min <= max', () => {
    const result = availabilitySchema.safeParse({ ...validAvailability, minCartQty: 5, maxCartQty: 2 })
    expect(messagesFor(result, 'minCartQty')).toHaveLength(1)
    expect(messagesFor(result, 'maxCartQty')).toHaveLength(1)
    expect(availabilitySchema.safeParse({ ...validAvailability, minCartQty: 3, maxCartQty: 3 }).success).toBe(true)
  })

  it('wymaga liczb całkowitych w limitach koszyka', () => {
    expect(availabilitySchema.safeParse({ ...validAvailability, minCartQty: 1.5 }).success).toBe(false)
  })
})
