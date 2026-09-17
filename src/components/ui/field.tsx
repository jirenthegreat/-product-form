import * as React from 'react'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="field-group" className={cn('flex flex-col gap-4', className)} {...props} />
}

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & { orientation?: 'vertical' | 'horizontal' }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        'group/field flex w-full gap-2 data-[invalid=true]:text-destructive',
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
        className,
      )}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn('text-[13px] text-foreground', className)} {...props} />
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return <p data-slot="field-description" className={cn('text-xs text-muted-foreground', className)} {...props} />
}

function FieldError({ className, errors, ...props }: React.ComponentProps<'p'> & { errors?: Array<{ message?: string } | undefined> }) {
  const messages = [...new Set(errors?.map((e) => e?.message).filter(Boolean))]
  if (messages.length === 0) return null
  return (
    <p role="alert" data-slot="field-error" className={cn('text-xs text-destructive', className)} {...props}>
      {messages[0]}
    </p>
  )
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel }
