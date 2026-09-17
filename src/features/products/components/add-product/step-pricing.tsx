import { productFormOptions, withForm } from './form-context'
import { grossToNet, netToGross } from '@/features/products/lib/price'
import { CURRENCIES, VAT_RATES } from '@/features/products/model/constants'

const vatOptions = VAT_RATES.map((rate) => ({ value: String(rate), label: `${rate}%` }))
const currencyOptions = CURRENCIES.map((currency) => ({ value: currency, label: currency }))

/** Przeliczone pole ustawiamy bez odpalania jego listenerów – inaczej powstałaby pętla netto ⇄ brutto. */
const derivedUpdate = { dontRunListeners: true } as const

export const StepPricing = withForm({
  ...productFormOptions,
  render: function StepPricing({ form }) {
    const recalculate = (source: 'net' | 'gross') => {
      const { netPrice, grossPrice, vatRate } = form.state.values
      form.setFieldValue('priceSource', source, derivedUpdate)
      if (source === 'net') {
        form.setFieldValue('grossPrice', netToGross(netPrice, vatRate), derivedUpdate)
      } else {
        form.setFieldValue('netPrice', grossToNet(grossPrice, vatRate), derivedUpdate)
      }
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="netPrice" listeners={{ onChange: () => recalculate('net') }}>
          {(field) => (
            <field.NumberField label="Cena netto" placeholder="0.00" decimal autoFocus />
          )}
        </form.AppField>
        <form.AppField name="grossPrice" listeners={{ onChange: () => recalculate('gross') }}>
          {(field) => <field.NumberField label="Cena brutto" placeholder="0.00" decimal />}
        </form.AppField>
        <form.AppField
          name="vatRate"
          // Zmiana VAT przelicza pole, którego użytkownik nie edytował ostatnio.
          listeners={{ onChange: () => recalculate(form.state.values.priceSource) }}
        >
          {(field) => <field.SelectField label="Stawka VAT" options={vatOptions} parse={Number} />}
        </form.AppField>
        <form.AppField name="currency">
          {(field) => <field.SelectField label="Waluta" options={currencyOptions} />}
        </form.AppField>
      </div>
    )
  },
})
