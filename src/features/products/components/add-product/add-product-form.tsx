import { useState } from 'react'
import { standardSchemaValidators } from '@tanstack/react-form'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { productFormOptions, useAppForm } from './form-context'
import { StepErrorsContext } from './step-errors-context'
import { StepAvailability } from './step-availability'
import { StepBasicInfo } from './step-basic-info'
import { StepPricing } from './step-pricing'
import { Stepper, type StepDefinition } from './stepper'
import { Button } from '@/components/ui/button'
import { productFormSchema, productFormSteps } from '@/features/products/model/product-schema'
import { toProduct } from '@/features/products/model/to-product'
import type { Product } from '@/features/products/model/types'

const STEPS = [
  { title: 'Informacje', description: 'Dane podstawowe' },
  { title: 'Cena', description: 'Dane cenowe' },
  { title: 'Dostępność', description: 'Stany magazynowe' },
] as const satisfies readonly StepDefinition[]

const LAST_STEP = STEPS.length - 1

type AddProductFormProps = {
  onCreated: (product: Product) => void
}

/**
 * One form for every step: all values live in a single state, so going back loses nothing.
 * The form validator is swapped per step and "Dalej" is a plain submit, which means the step
 * only advances when the current step is valid.
 */
export function AddProductForm({ onCreated }: AddProductFormProps) {
  const [step, setStep] = useState(0)
  // after a failed attempt to move on, show errors for every field of the step
  const [showAllErrors, setShowAllErrors] = useState(false)

  const form = useAppForm({
    ...productFormOptions,
    validators: {
      // The current step's schema validates only its own fields; errors land on the matching form fields.
      onChange: ({ value }) =>
        standardSchemaValidators.validate({ value, validationSource: 'form' }, productFormSteps[step]),
    },
    onSubmitInvalid: () => setShowAllErrors(true),
    onSubmit: ({ value }) => {
      if (step < LAST_STEP) {
        setStep((current) => current + 1)
        setShowAllErrors(false)
        return
      }
      onCreated(toProduct(productFormSchema.parse(value)))
    },
  })

  return (
    <form
      noValidate
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <Stepper
        steps={STEPS}
        currentStep={step}
        className="mx-4 mt-4 border-y py-6 sm:mx-0 sm:mt-0 sm:h-[62px] sm:border-t-0 sm:px-4 sm:py-0"
      />

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:py-5">
        <StepErrorsContext.Provider value={showAllErrors}>
          {step === 0 && <StepBasicInfo form={form} />}
          {step === 1 && <StepPricing form={form} />}
          {step === 2 && <StepAvailability form={form} />}
        </StepErrorsContext.Provider>
      </div>

      <div className="flex h-[68px] shrink-0 items-center gap-2 border-t bg-background px-4">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => {
              setStep((current) => current - 1)
              setShowAllErrors(false)
            }}>
            <ArrowLeftIcon />
            Wstecz
          </Button>
        )}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button type="submit" className="ml-auto" disabled={isSubmitting}>
              {step < LAST_STEP ? (
                <>
                  Dalej
                  <ArrowRightIcon />
                </>
              ) : (
                'Zapisz produkt'
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
