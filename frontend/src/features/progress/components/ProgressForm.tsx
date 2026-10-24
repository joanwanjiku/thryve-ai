import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Field } from '../../../components/ui/Field'
import { buttonStyles, inputStyles } from '../../../components/ui/styles'
import { formatMetric, nowForInput } from '../format'
import { progressFormSchema, type ProgressFormValues } from '../schemas'
import { METRIC_TYPES, METRIC_UNITS, type MetricType } from '../types'

interface ProgressFormProps {
  defaultType: MetricType
  isPending: boolean
  error?: string
  onSubmit: (values: ProgressFormValues) => void
  onCancel: () => void
}

export function ProgressForm({ defaultType, isPending, error, onSubmit, onCancel }: ProgressFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgressFormValues>({
    resolver: zodResolver(progressFormSchema),
    defaultValues: { metricType: defaultType, recordedAt: nowForInput(), notes: '' },
  })
  const unit = METRIC_UNITS[useWatch({ control, name: 'metricType' })]

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Metric" htmlFor="metricType">
          <select id="metricType" className={inputStyles} {...register('metricType')}>
            {METRIC_TYPES.map((t) => (
              <option key={t} value={t}>
                {formatMetric(t)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={unit ? `Value (${unit})` : 'Value'} htmlFor="value" error={errors.value?.message}>
          <input
            id="value"
            type="number"
            min={0}
            step="0.1"
            className={inputStyles}
            {...register('value', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Recorded at" htmlFor="recordedAt" error={errors.recordedAt?.message} className="sm:col-span-2">
          <input id="recordedAt" type="datetime-local" className={inputStyles} {...register('recordedAt')} />
        </Field>
      </div>
      <Field label="Notes" htmlFor="notes">
        <textarea id="notes" rows={2} className={inputStyles} {...register('notes')} />
      </Field>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className={buttonStyles.secondary}>
          Cancel
        </button>
        <button type="submit" disabled={isPending} className={buttonStyles.primary}>
          {isPending ? 'Saving…' : 'Save entry'}
        </button>
      </div>
    </form>
  )
}
