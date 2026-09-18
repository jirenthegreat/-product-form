import { z } from 'zod'

import { CATEGORIES, CURRENCIES, FEATURES, MANUFACTURERS, VAT_RATES } from './constants'

/** The form holds a string (empty before a choice is made); parsing narrows it down to the list. */
const oneOf = <const T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.string().pipe(z.enum(values, { error: message }))

/** Numeric field that may be empty (`undefined`) while the form is being filled in. */
const requiredNumber = (requiredMessage: string) =>
  z.number({
    error: (issue) => (issue.input === undefined ? requiredMessage : 'Wprowadź poprawną liczbę'),
  })

const integer = (requiredMessage: string) =>
  requiredNumber(requiredMessage).int('Wartość musi być liczbą całkowitą')

/* --------------------------- Step 1: basic info --------------------------- */

export const basicInfoSchema = z.object({
  // `abort` stops further checks so an empty field shows one message instead of two
  name: z
    .string()
    .trim()
    .min(1, { error: 'Nazwa produktu jest wymagana', abort: true })
    .min(3, 'Nazwa musi mieć co najmniej 3 znaki'),
  sku: z
    .string()
    .trim()
    .min(1, { error: 'SKU jest wymagane', abort: true })
    .max(24, 'SKU może mieć maksymalnie 24 znaki')
    .regex(/^[A-Za-z0-9]+$/, 'SKU może zawierać tylko litery i cyfry'),
  description: z.string().trim(),
  manufacturer: oneOf(MANUFACTURERS, 'Producent jest wymagany'),
  category: oneOf(CATEGORIES, 'Kategoria jest wymagana'),
  features: z
    .array(oneOf(FEATURES, 'Nieznana cecha'))
    .min(1, 'Wybierz co najmniej jedną cechę'),
})

/* ----------------------------- Step 2: pricing ---------------------------- */

export const pricingSchema = z.object({
  netPrice: requiredNumber('Cena netto jest wymagana').positive('Cena musi być większa od 0'),
  grossPrice: requiredNumber('Cena brutto jest wymagana').positive('Cena musi być większa od 0'),
  vatRate: z.number().pipe(z.literal(VAT_RATES, { error: 'Wybierz stawkę VAT' })),
  currency: oneOf(CURRENCIES, 'Wybierz walutę'),
})

/* --------------------------- Step 3: availability ------------------------- */

export const availabilitySchema = z
  .object({
    isAvailable: z.boolean(),
    isLimited: z.boolean(),
    stock: z.number().optional(),
    minCartQty: integer('Podaj minimalną ilość').min(1, 'Minimalna ilość musi wynosić co najmniej 1'),
    maxCartQty: integer('Podaj maksymalną ilość').min(1, 'Maksymalna ilość musi wynosić co najmniej 1'),
  })
  // `when: () => true` runs cross-field rules even when other fields are invalid,
  // so the user sees every problem at once.
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

/** Full schema used when the product is finally saved. */
export const productFormSchema = z
  .object({ ...basicInfoSchema.shape, ...pricingSchema.shape })
  .and(availabilitySchema)

export type ProductFormOutput = z.output<typeof productFormSchema>
