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
        <col className="w-[27%]" />
        <col className="w-[13.5%]" />
        <col className="w-[13.5%]" />
        <col className="w-[13.5%]" />
        <col className="w-[13.5%]" />
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
      <TableBody className="bg-card">
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="truncate font-medium">{product.name}</TableCell>
            <TableCell className="truncate text-[11px] text-muted-foreground">{product.sku}</TableCell>
            <TableCell className="text-muted-foreground">{product.category}</TableCell>
            <TableCell className="font-medium">{formatPrice(product.grossPrice, product.currency)}</TableCell>
            <TableCell>
              <ProductStatusBadge isAvailable={product.isAvailable} />
            </TableCell>
            <TableCell>{formatStock(product)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Widok mobile – karty. */
export function ProductsCardList({ products }: { products: Product[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {products.map((product) => (
        <li key={product.id} className="rounded-xl border bg-card p-2.5">
          <div className="flex items-start justify-between gap-2 px-0.5 pt-1">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium">{product.name}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{product.sku}</p>
            </div>
            <ProductStatusBadge isAvailable={product.isAvailable} />
          </div>
          <dl className="mt-2.5 grid grid-cols-[1fr_1fr_0.8fr] gap-2 rounded-lg bg-muted/70 p-2.5">
            {[
              ['Kategoria', product.category],
              ['Cena brutto', formatPrice(product.grossPrice, product.currency)],
              ['Magazyn', formatStock(product)],
            ].map(([label, value]) => (
              <div key={label} className="flex min-w-0 flex-col gap-1.5">
                <dt className="text-[11px] text-muted-foreground">{label}</dt>
                <dd className="truncate text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
  )
}
