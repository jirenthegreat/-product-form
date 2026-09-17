import type { Category, Currency, Feature, Manufacturer, VatRate } from './constants'

export type Product = {
  id: string
  name: string
  sku: string
  description: string
  manufacturer: Manufacturer
  category: Category
  features: Feature[]
  netPrice: number
  grossPrice: number
  vatRate: VatRate
  currency: Currency
  isAvailable: boolean
  isLimited: boolean
  /** `null`, gdy produkt nie jest limitowany */
  stock: number | null
  minCartQty: number
  maxCartQty: number
}

/** Wartości formularza – pola liczbowe mogą być chwilowo puste. */
export type ProductFormValues = {
  name: string
  sku: string
  description: string
  manufacturer: string
  category: string
  features: string[]
  netPrice: number | undefined
  grossPrice: number | undefined
  vatRate: number
  currency: string
  /** Które pole ceny użytkownik edytował ostatnio – decyduje, co przeliczyć po zmianie VAT. */
  priceSource: 'net' | 'gross'
  isAvailable: boolean
  isLimited: boolean
  stock: number | undefined
  minCartQty: number | undefined
  maxCartQty: number | undefined
}

export const productFormDefaultValues: ProductFormValues = {
  name: '',
  sku: '',
  description: '',
  manufacturer: '',
  category: '',
  features: [],
  netPrice: undefined,
  grossPrice: undefined,
  vatRate: 23,
  currency: 'PLN',
  priceSource: 'net',
  isAvailable: true,
  isLimited: false,
  stock: undefined,
  minCartQty: 1,
  maxCartQty: 10,
}
