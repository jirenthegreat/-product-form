import { parseAsInteger, useQueryState } from 'nuqs'
import { toast } from 'sonner'

import { AddProductDialog } from './add-product/add-product-dialog'
import { ProductsPagination } from './products-pagination'
import { ProductsCardList, ProductsTable } from './products-table'
import { pluralizeProducts } from '@/features/products/lib/format'
import { PRODUCTS_PAGE_SIZE } from '@/features/products/model/constants'
import { useProducts } from '@/features/products/hooks/use-products'
import type { Product } from '@/features/products/model/types'

export function ProductsPage() {
  const { products, addProduct } = useProducts()
  const [pageParam, setPageParam] = useQueryState('page', parseAsInteger.withDefault(1))

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PAGE_SIZE))
  // Ręcznie wpisany numer strony spoza zakresu (np. ?page=99) przycinamy do dostępnych stron.
  const page = Math.min(Math.max(1, pageParam), totalPages)
  const visibleProducts = products.slice((page - 1) * PRODUCTS_PAGE_SIZE, page * PRODUCTS_PAGE_SIZE)

  const countLabel = `${products.length} ${pluralizeProducts(products.length)}`
  const pageSummary = `Strona ${page} z ${totalPages} · ${countLabel}`

  const handleCreated = (product: Product) => {
    addProduct(product)
    toast.success('Produkt został dodany')
  }

  const pagination = (
    <ProductsPagination page={page} totalPages={totalPages} onPageChange={(next) => void setPageParam(next)} />
  )

  return (
    <main className="mx-auto flex w-full max-w-[1272px] flex-col gap-4 px-4 py-6 sm:gap-6 sm:py-[50px]">
      <header className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-xl leading-7 font-semibold">Produkty</h1>
          <p className="text-sm leading-5 text-muted-foreground">{countLabel} w katalogu</p>
        </div>
        <AddProductDialog onCreated={handleCreated} />
      </header>

      {/* Desktop */}
      <section aria-label="Lista produktów" className="hidden overflow-hidden rounded-lg border bg-card shadow-xs sm:block">
        <ProductsTable products={visibleProducts} />
        <div className="flex items-center justify-between gap-4 border-t bg-table-muted p-4">
          <p className="text-xs leading-4 text-muted-foreground">{pageSummary}</p>
          {pagination}
        </div>
      </section>

      {/* Mobile */}
      <section aria-label="Lista produktów" className="flex flex-col gap-6 sm:hidden">
        <ProductsCardList products={visibleProducts} />
        <div className="flex flex-col items-center gap-4">
          <p className="text-xs leading-4 text-muted-foreground">{pageSummary}</p>
          {pagination}
        </div>
      </section>
    </main>
  )
}
