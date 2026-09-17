import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
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

/** Rozmiary z Figmy: elementy 32px i zaokrąglenie 8px (przyciski w projekcie są „pigułkami”). */
const itemClass = 'size-8 rounded-md'
const prevClass = 'h-8 rounded-md pr-2.5 pl-1.5'
const nextClass = 'h-8 rounded-md pr-1.5 pl-2.5'

export function ProductsPagination({ page, totalPages, onPageChange, className }: ProductsPaginationProps) {
  /** Linki mają poprawny `href` (działa środkowy przycisk myszy), ale stroną steruje nuqs. */
  const linkProps = (target: number, disabled = false) => ({
    href: `?page=${target}`,
    'aria-disabled': disabled || undefined,
    onClick: (event: React.MouseEvent) => {
      event.preventDefault()
      if (!disabled) onPageChange(target)
    },
  })

  const disabledClass = 'aria-disabled:pointer-events-none aria-disabled:opacity-50'

  return (
    <Pagination className={cn('mx-0 w-auto', className)}>
      <PaginationContent className="gap-0.5">
        <PaginationItem>
          <PaginationPrevious className={cn(prevClass, disabledClass)} {...linkProps(page - 1, page <= 1)} />
        </PaginationItem>

        {getPageItems(page, totalPages).map((item, index) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis className="size-8" />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                isActive={item === page}
                aria-label={`Strona ${item}`}
                className={cn(
                  itemClass,
                  // aktywna strona w projekcie jest wypełniona kolorem głównym
                  item === page && 'border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                )}
                {...linkProps(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext className={cn(nextClass, disabledClass)} {...linkProps(page + 1, page >= totalPages)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
