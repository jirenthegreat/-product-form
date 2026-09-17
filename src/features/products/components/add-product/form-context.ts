import { createFormHook, formOptions } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-hook-contexts'
import { NumberField, SelectField, TextareaField, TextField, ToggleChipsField } from './form-fields'
import { productFormDefaultValues } from '@/features/products/model/types'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, NumberField, TextareaField, SelectField, ToggleChipsField },
  formComponents: {},
})

export const productFormOptions = formOptions({ defaultValues: productFormDefaultValues })
