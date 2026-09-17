import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return <nav role="navigation" aria-label="Paginacja" data-slot="pagination" className={cn('flex', className)} {...props} />
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return <ul data-slot="pagination-content" className={cn('flex flex-row items-center gap-1', className)} {...props} />
}

function PaginationItem(props: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationButtonProps = { isActive?: boolean } & React.ComponentProps<'button'>

function PaginationButton({ className, isActive, ...props }: PaginationButtonProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'icon' }),
        'size-7 text-sm font-medium',
        isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
        className,
      )}
      {...props}
    />
  )
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-label="Poprzednia strona"
      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1 px-2 font-normal text-muted-foreground', className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span>Wstecz</span>
    </button>
  )
}

function PaginationNext({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      aria-label="Następna strona"
      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1 px-2', className)}
      {...props}
    >
      <span>Dalej</span>
      <ChevronRightIcon />
    </button>
  )
}

export { Pagination, PaginationButton, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious }
