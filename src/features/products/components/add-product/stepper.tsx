import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export type StepDefinition = { title: string; description: string }

type StepperProps = {
  steps: readonly StepDefinition[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <ol aria-label="Postęp formularza" className={cn('grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-3', className)}>
      {steps.map((step, index) => {
        const status = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming'
        return (
          <li
            key={step.title}
            aria-current={status === 'current' ? 'step' : undefined}
            className="flex flex-col gap-3 sm:contents"
          >
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-2.5">
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  status === 'upcoming' ? 'border bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground',
                )}
              >
                {status === 'complete' ? <CheckIcon className="size-3.5" strokeWidth={2.5} aria-hidden /> : index + 1}
                <span className="sr-only">{status === 'complete' ? ' (ukończony)' : ''}</span>
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={cn('text-[13px] font-medium', status === 'upcoming' && 'text-muted-foreground')}>
                  {step.title}
                </span>
                <span className="text-[11px] whitespace-nowrap text-muted-foreground">{step.description}</span>
              </span>
            </div>
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  'hidden h-px min-w-6 flex-1 transition-colors sm:block',
                  index < currentStep ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
