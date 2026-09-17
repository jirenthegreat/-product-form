import { ProductStatusBadge } from './product-status-badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/features/products/lib/format'
import type { Product } from '@/features/products/model/types'

const formatStock = (product: Product) => (product.isLimited ? String(product.stock ?? 0) : '—')

/** Widok desktop – tabela. */
export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <Table className="table-fixed">
      <colgroup>
        {/* kolumna nazwy ma w projekcie stałe 357px, pozostałe dzielą resztę po równo */}
        <col className="w-[357px]" />
        <col />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Nazwa</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Kategoria</TableHead>
          <TableHead>Cena Brutto</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Magazyn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="truncate font-medium">{product.name}</TableCell>
            <TableCell className="truncate text-xs text-muted-foreground">{product.sku}</TableCell>
            <TableCell className="truncate text-muted-foreground">{product.category}</TableCell>
            <TableCell className="truncate font-medium">{formatPrice(product.grossPrice, product.currency)}</TableCell>
            <TableCell>
              <ProductStatusBadge isAvailable={product.isAvailable} />
            </TableCell>
            <TableCell className="truncate">{formatStock(product)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Widok mobile – karty. */
export function ProductsCardList({ products }: { products: Product[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {products.map((product) => (
        <li key={product.id} className="flex flex-col gap-2 rounded-xl border bg-card p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-base leading-6 font-medium">{product.name}</p>
              <p className="truncate text-xs leading-4 text-muted-foreground">{product.sku}</p>
            </div>
            <ProductStatusBadge isAvailable={product.isAvailable} />
          </div>
          <dl className="flex gap-1 rounded-[9px] bg-accent p-3">
            {(
              [
                ['Kategoria', product.category, false],
                ['Cena brutto', formatPrice(product.grossPrice, product.currency), true],
                ['Magazyn', formatStock(product), false],
              ] as const
            ).map(([label, value, emphasized]) => (
              <div key={label} className="flex min-w-0 flex-1 flex-col gap-1">
                <dt className="text-xs leading-4 text-muted-foreground">{label}</dt>
                <dd className={emphasized ? 'truncate text-sm leading-5 font-medium' : 'truncate text-sm leading-5'}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  )
}
