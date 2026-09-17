import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getPageItems } from '@/features/products/lib/pagination'
import { cn } from '@/lib/utils'

type ProductsPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function ProductsPagination({ page, totalPages, onPageChange, className }: ProductsPaginationProps) {
  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
        </PaginationItem>
        {getPageItems(page, totalPages).map((item, index) => (
          <PaginationItem key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
            {item === 'ellipsis' ? (
              <span className="px-1 text-muted-foreground">…</span>
            ) : (
              <PaginationButton isActive={item === page} aria-label={`Strona ${item}`} onClick={() => onPageChange(item)}>
                {item}
              </PaginationButton>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
