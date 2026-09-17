export const MANUFACTURERS = ['Apple', 'Samsung', 'Sony', 'Bosch', 'Xiaomi', 'LG'] as const
export const CATEGORIES = ['Komputery', 'Telefony', 'RTV', 'AGD', 'Akcesoria'] as const
export const FEATURES = ['Bluetooth', 'WiFi', 'USB-C', 'Wodoodporny', 'Bezprzewodowy', 'Ekologiczny', 'Premium'] as const
export const VAT_RATES = [23, 8, 5, 0] as const
export const CURRENCIES = ['PLN', 'EUR', 'USD'] as const

export const PRODUCTS_PAGE_SIZE = 5

export type Manufacturer = (typeof MANUFACTURERS)[number]
export type Category = (typeof CATEGORIES)[number]
export type Feature = (typeof FEATURES)[number]
export type VatRate = (typeof VAT_RATES)[number]
export type Currency = (typeof CURRENCIES)[number]
