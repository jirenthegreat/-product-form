import { useCallback, useEffect, useState } from 'react'

import { mockProducts } from '@/features/products/model/mock-products'
import type { Product } from '@/features/products/model/types'

const STORAGE_KEY = 'products'

function readStoredProducts(): Product[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Product[]) : mockProducts
  } catch {
    return mockProducts
  }
}

/**
 * Lista produktów (mock) zapisywana w localStorage – dzięki temu odświeżenie strony
 * zachowuje zarówno dodane produkty, jak i stronę paginacji z URL.
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>(readStoredProducts)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch {
      // brak dostępu do storage (np. tryb prywatny) – działamy tylko w pamięci
    }
  }, [products])

  const addProduct = useCallback((product: Product) => {
    setProducts((current) => [...current, product])
  }, [])

  return { products, addProduct }
}
