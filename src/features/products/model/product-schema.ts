import { z } from 'zod'

import { CATEGORIES, CURRENCIES, FEATURES, MANUFACTURERS, VAT_RATES } from './constants'

/** Formularz trzyma string (np. pusty '' przed wyborem), a wynik parsowania jest zawężony do listy. */
const oneOf = <const T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.string().pipe(z.enum(values, { error: message }))

/** Pole liczbowe, które w formularzu może być puste (`undefined`). */
const requiredNumber = (requiredMessage: string) =>
  z.number({
    error: (issue) => (issue.input === undefined ? requiredMessage : 'Wprowadź poprawną liczbę'),
  })

const integer = (requiredMessage: string) =>
  requiredNumber(requiredMessage).int('Wartość musi być liczbą całkowitą')

/* ---------------------------------- Krok 1 --------------------------------- */

export const basicInfoSchema = z.object({
  name: z.string().trim().min(1, 'Nazwa produktu jest wymagana').min(3, 'Nazwa musi mieć co najmniej 3 znaki'),
  sku: z
    .string()
    .trim()
    .min(1, 'SKU jest wymagane')
    .max(24, 'SKU może mieć maksymalnie 24 znaki')
    .regex(/^[A-Za-z0-9]+$/, 'SKU może zawierać tylko litery i cyfry'),
  description: z.string().trim(),
  manufacturer: oneOf(MANUFACTURERS, 'Wybierz producenta'),
  category: oneOf(CATEGORIES, 'Wybierz kategorię'),
  features: z
    .array(oneOf(FEATURES, 'Nieznana cecha'))
    .min(1, 'Wybierz co najmniej jedną cechę'),
})

/* ---------------------------------- Krok 2 --------------------------------- */

export const pricingSchema = z.object({
  netPrice: requiredNumber('Cena netto jest wymagana').positive('Cena musi być większa od 0'),
  grossPrice: requiredNumber('Cena brutto jest wymagana').positive('Cena musi być większa od 0'),
  vatRate: z.number().pipe(z.literal(VAT_RATES, { error: 'Wybierz stawkę VAT' })),
  currency: oneOf(CURRENCIES, 'Wybierz walutę'),
})

/* ---------------------------------- Krok 3 --------------------------------- */

export const availabilitySchema = z
  .object({
    isAvailable: z.boolean(),
    isLimited: z.boolean(),
    stock: z.number().optional(),
    minCartQty: integer('Podaj minimalną ilość').min(1, 'Minimalna ilość musi wynosić co najmniej 1'),
    maxCartQty: integer('Podaj maksymalną ilość').min(1, 'Maksymalna ilość musi wynosić co najmniej 1'),
  })
  // `when: () => true` – reguły między polami uruchamiamy także wtedy, gdy inne pola mają błędy,
  // dzięki czemu użytkownik widzi wszystkie problemy naraz.
  .superRefine(
    (data, ctx) => {
      if (!data.isLimited) return
      const stock = integer('Podaj ilość na magazynie').nonnegative('Ilość nie może być ujemna').safeParse(data.stock)
      if (!stock.success) {
        ctx.addIssue({ code: 'custom', path: ['stock'], message: stock.error.issues[0]?.message ?? 'Nieprawidłowa ilość' })
      }
    },
    { when: () => true },
  )
  .superRefine(
    (data, ctx) => {
      const { minCartQty: min, maxCartQty: max } = data
      if (typeof min !== 'number' || typeof max !== 'number' || min <= max) return
      ctx.addIssue({ code: 'custom', path: ['minCartQty'], message: 'Minimalna ilość nie może być większa niż maksymalna' })
      ctx.addIssue({ code: 'custom', path: ['maxCartQty'], message: 'Maksymalna ilość nie może być mniejsza niż minimalna' })
    },
    { when: () => true },
  )

export const productFormSteps = [basicInfoSchema, pricingSchema, availabilitySchema] as const

/** Pełny schemat – używany przy finalnym zapisie. */
export const productFormSchema = z
  .object({ ...basicInfoSchema.shape, ...pricingSchema.shape })
  .and(availabilitySchema)

export type ProductFormOutput = z.output<typeof productFormSchema>
