import { useFieldContext } from './form-hook-contexts'
import { cn } from '@/lib/utils'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { parseNumberInput } from '@/features/products/lib/format'

type Option = { value: string; label: string }

type BaseFieldProps = {
  label: string
  className?: string
}

/** Błąd pokazujemy dopiero, gdy użytkownik dotknął pola albo próbował przejść dalej. */
function useFieldState<T>() {
  const field = useFieldContext<T>()
  const { isTouched, isValid, errors } = field.state.meta
  const isInvalid = isTouched && !isValid
  return { field, isInvalid, errors, errorId: `${field.name}-error` }
}

export function TextField({ label, className, ...props }: BaseFieldProps & React.ComponentProps<typeof Input>) {
  const { field, isInvalid, errors, errorId } = useFieldState<string>()
  return (
    <Field data-invalid={isInvalid} className={cn('gap-2', className)}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
        {...props}
      />
      {isInvalid && <FieldError id={errorId} errors={errors} />}
    </Field>
  )
}

export function NumberField({ label, className, ...props }: BaseFieldProps & React.ComponentProps<typeof Input>) {
  const { field, isInvalid, errors, errorId } = useFieldState<number | undefined>()
  return (
    <Field data-invalid={isInvalid} className={cn('gap-2', className)}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        // ukrywamy strzałki inputa liczbowego – w projekcie ich nie ma
        className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(parseNumberInput(e))}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
        {...props}
      />
      {isInvalid && <FieldError id={errorId} errors={errors} />}
    </Field>
  )
}

export function TextareaField({ label, className, ...props }: BaseFieldProps & React.ComponentProps<typeof Textarea>) {
  const { field, isInvalid, errors, errorId } = useFieldState<string>()
  return (
    <Field data-invalid={isInvalid} className={cn('gap-2', className)}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        // w projekcie textarea ma stałą wysokość, bez uchwytu do rozciągania
        className="resize-none"

        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
        {...props}
      />
      {isInvalid && <FieldError id={errorId} errors={errors} />}
    </Field>
  )
}

type SelectFieldProps = BaseFieldProps & {
  options: readonly Option[]
  placeholder?: string
  /** Pozwala trzymać w formularzu np. liczbę, a w Radix Select string. */
  parse?: (value: string) => unknown
}

export function SelectField({ label, className, options, placeholder, parse }: SelectFieldProps) {
  const { field, isInvalid, errors, errorId } = useFieldState<unknown>()
  const value = field.state.value === '' || field.state.value == null ? '' : String(field.state.value)
  return (
    <Field data-invalid={isInvalid} className={cn('gap-2', className)}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        name={field.name}
        value={value}
        onValueChange={(next) => field.handleChange(parse ? parse(next) : next)}
        onOpenChange={(open) => {
          if (!open) field.handleBlur()
        }}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError id={errorId} errors={errors} />}
    </Field>
  )
}

type ToggleChipsFieldProps = BaseFieldProps & { options: readonly string[] }

/** Multi-select w formie „chipsów” – zgodnie z projektem. */
export function ToggleChipsField({ label, className, options }: ToggleChipsFieldProps) {
  const { field, isInvalid, errors, errorId } = useFieldState<string[]>()
  const labelId = `${field.name}-label`
  return (
    <Field data-invalid={isInvalid} className={cn('gap-2', className)}>
      <FieldLabel id={labelId} asChild>
        <span>{label}</span>
      </FieldLabel>
      <ToggleGroup
        type="multiple"
        variant="outline"
        spacing={2}
        className="flex-wrap"
        value={field.state.value}
        onValueChange={(next) => {
          field.handleChange(next)
          field.handleBlur()
        }}
        aria-labelledby={labelId}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option}
            value={option}
            // Figma: chipsy 24px, w pełni zaokrąglone, nieaktywne wyszarzone
            className="h-[26px] rounded-full border-border px-2 font-normal text-muted-foreground shadow-none data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
          >
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {isInvalid && <FieldError id={errorId} errors={errors} />}
    </Field>
  )
}
