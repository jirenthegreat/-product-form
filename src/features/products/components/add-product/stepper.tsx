import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export type StepDefinition = { title: string; description: string }

type StepperProps = {
  steps: readonly StepDefinition[]
  currentStep: number
  className?: string
}

/**
 * Desktop: kroki w jednym rzędzie połączone linią (niebieska po ukończeniu kroku).
 * Mobile: trzy kolumny, numer nad opisem, bez linii – zgodnie z Figmą.
 */
export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <ol aria-label="Postęp formularza" className={cn('flex items-start gap-4 sm:items-center', className)}>
      {steps.map((step, index) => {
        const status = index < currentStep ? 'complete' : index === currentStep ? 'current' : 'upcoming'
        const isLast = index === steps.length - 1
        return (
          <li
            key={step.title}
            aria-current={status === 'current' ? 'step' : undefined}
            // na mobile wyrównanie do góry, żeby kółka trzymały jedną linię, gdy opis łamie się na dwie
            className="flex min-w-0 flex-1 items-start gap-4 sm:flex-none sm:items-center"
          >
            <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm leading-5 font-semibold transition-colors',
                  status === 'upcoming'
                    ? 'border bg-accent text-muted-foreground'
                    : 'bg-primary text-white',
                )}
              >
                {status === 'complete' ? <CheckIcon className="size-4" aria-hidden /> : index + 1}
              </span>
              <span className={cn('flex min-w-0 flex-col gap-0.5 sm:whitespace-nowrap', status === 'upcoming' && 'text-muted-foreground')}>
                <span className="text-sm leading-5 font-medium">
                  {step.title}
                  {status === 'complete' && <span className="sr-only"> (ukończony)</span>}
                </span>
                <span className="text-xs leading-4 text-muted-foreground">{step.description}</span>
              </span>
            </div>
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'hidden h-px w-[67px] shrink-0 transition-colors sm:block',
                  index < currentStep ? 'bg-primary' : 'bg-[#e4e4e4]',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
