import type { ProductFormOutput } from './product-schema'
import type { Product } from './types'

export function toProduct(data: ProductFormOutput, id: string = crypto.randomUUID()): Product {
  return {
    id,
    name: data.name,
    sku: data.sku,
    description: data.description,
    manufacturer: data.manufacturer,
    category: data.category,
    features: data.features,
    netPrice: data.netPrice,
    grossPrice: data.grossPrice,
    vatRate: data.vatRate,
    currency: data.currency,
    isAvailable: data.isAvailable,
    isLimited: data.isLimited,
    stock: data.isLimited ? (data.stock ?? 0) : null,
    minCartQty: data.minCartQty,
    maxCartQty: data.maxCartQty,
  }
}
