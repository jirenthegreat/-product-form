import { productFormOptions, withForm } from './form-context'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

export const StepAvailability = withForm({
  ...productFormOptions,
  render: function StepAvailability({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <form.Field name="isAvailable">
          {(field) => (
            <div className="flex items-center gap-2">
              <Switch id={field.name} checked={field.state.value} onCheckedChange={field.handleChange} />
              <Label htmlFor={field.name} className="leading-5">
                Produkt jest dostępny
              </Label>
            </div>
          )}
        </form.Field>

        <Separator />

        <form.Field
          name="isLimited"
          listeners={{
            onChange: ({ value }) => {
              // Clearing the quantity on uncheck keeps it out of the product and drops a stale error.
              if (!value) form.resetField('stock')
            },
          }}
        >
          {(field) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked === true)}
              />
              <Label htmlFor={field.name} className="leading-5">
                Produkt limitowany
              </Label>
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => state.values.isLimited}>
          {(isLimited) =>
            isLimited && (
              <form.AppField name="stock">
                {(field) => (
                  <field.NumberField
                    label="Ilość na magazynie"
                    placeholder="0"
                    autoFocus
                    className="animate-in fade-in-0 slide-in-from-top-1 sm:max-w-[calc(50%-0.5rem)]"
                  />
                )}
              </form.AppField>
            )
          }
        </form.Subscribe>

        <Separator />

        <fieldset className="flex flex-col">
          <legend className="mb-4 text-base leading-6 font-medium">Limity koszyka</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* min ≤ max is checked by the form-level validator, so both fields refresh together. */}
            <form.AppField name="minCartQty">
              {(field) => <field.NumberField label="Minimalna ilość" />}
            </form.AppField>
            <form.AppField name="maxCartQty">
              {(field) => <field.NumberField label="Maksymalna ilość" />}
            </form.AppField>
          </div>
        </fieldset>
      </div>
    )
  },
})
