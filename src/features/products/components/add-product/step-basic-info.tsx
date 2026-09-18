import { productFormOptions, withForm } from './form-context'
import { CATEGORIES, FEATURES, MANUFACTURERS } from '@/features/products/model/constants'

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }))

export const StepBasicInfo = withForm({
  ...productFormOptions,
  render: function StepBasicInfo({ form }) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="name">
          {(field) => <field.TextField label="Nazwa produktu" placeholder="np. MacBook Pro 14" autoFocus />}
        </form.AppField>
        {/* no maxLength attribute – the schema enforces the limit so the user sees the message */}
        <form.AppField name="sku">
          {(field) => <field.TextField label="SKU produktu" placeholder="np. MBP14M3PRO" autoComplete="off" />}
        </form.AppField>
        <form.AppField name="description">
          {(field) => <field.TextareaField label="Opis" placeholder="Krótki opis produktu" className="sm:col-span-2" />}
        </form.AppField>
        <form.AppField name="manufacturer">
          {(field) => (
            <field.SelectField label="Producent" placeholder="Wybierz producenta" options={toOptions(MANUFACTURERS)} />
          )}
        </form.AppField>
        <form.AppField name="category">
          {(field) => <field.SelectField label="Kategoria" placeholder="Wybierz kategorię" options={toOptions(CATEGORIES)} />}
        </form.AppField>
        <form.AppField name="features">
          {(field) => <field.ToggleChipsField label="Cechy produktu" options={FEATURES} className="sm:col-span-2" />}
        </form.AppField>
      </div>
    )
  },
})
