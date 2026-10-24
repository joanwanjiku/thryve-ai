import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { Modal } from '../../components/ui/Modal'
import { buttonStyles } from '../../components/ui/styles'
import { ProgressChart } from '../../features/progress/components/ProgressChart'
import { ProgressForm } from '../../features/progress/components/ProgressForm'
import { formatDateTime, formatMetric, formatValue } from '../../features/progress/format'
import { useCreateProgressMetric, useDeleteProgressMetric, useMetricHistory } from '../../features/progress/hooks'
import { toCreateRequest } from '../../features/progress/schemas'
import { METRIC_TYPES, type MetricType, type ProgressMetric } from '../../features/progress/types'
import { getErrorMessage } from '../../lib/errors'

function parseMetric(value: string | null): MetricType {
  return METRIC_TYPES.find((t) => t === value) ?? 'WEIGHT'
}

export function ProgressPage() {
  const [params, setParams] = useSearchParams()
  const metric = parseMetric(params.get('metric'))
  const history = useMetricHistory(metric)
  const createMetric = useCreateProgressMetric()
  const deleteMetric = useDeleteProgressMetric()

  const [isFormOpen, setFormOpen] = useState(false)
  const [toDelete, setToDelete] = useState<ProgressMetric | null>(null)

  const closeForm = () => {
    createMetric.reset()
    setFormOpen(false)
  }
  const closeDelete = () => {
    deleteMetric.reset()
    setToDelete(null)
  }

  const entries = history.data ?? []
  const latest = entries[0]

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Progress</h1>
        <button type="button" onClick={() => setFormOpen(true)} className={buttonStyles.primary}>
          Log entry
        </button>
      </div>

      <div role="tablist" aria-label="Metric" className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {METRIC_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={t === metric}
            onClick={() => setParams({ metric: t }, { replace: true })}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
              t === metric ? 'bg-charcoal-900 text-white' : 'bg-gray-100 text-charcoal-800 hover:bg-gray-200'
            }`}
          >
            {formatMetric(t)}
          </button>
        ))}
      </div>

      <section role="tabpanel" aria-label={formatMetric(metric)} className="mt-6">
        {history.isPending && <p className="text-charcoal-700">Loading…</p>}
        {history.isError && (
          <p role="alert" className="text-red-600">
            {getErrorMessage(history.error)}
          </p>
        )}
        {history.isSuccess && entries.length === 0 && (
          <p className="text-charcoal-700">No {formatMetric(metric).toLowerCase()} entries yet.</p>
        )}

        {latest && (
          <>
            <p className="text-sm text-charcoal-700">Latest</p>
            <p className="text-3xl font-bold">{formatValue(metric, latest.value)}</p>
            {entries.length > 1 && (
              <div className="mt-4 rounded-xl border border-gray-200 p-4">
                <ProgressChart type={metric} entries={entries} />
              </div>
            )}

            <table className="mt-6 w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-charcoal-700">
                <tr>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Value</th>
                  <th className="hidden py-2 font-medium sm:table-cell">Notes</th>
                  <th className="py-2">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-gray-100">
                    <td className="py-2">{formatDateTime(e.recordedAt)}</td>
                    <td className="py-2 font-medium">{formatValue(metric, e.value)}</td>
                    <td className="hidden py-2 text-charcoal-700 sm:table-cell">{e.notes}</td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() => setToDelete(e)}
                        className="text-sm font-medium text-red-600 hover:underline"
                        aria-label={`Delete entry from ${formatDateTime(e.recordedAt)}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      {isFormOpen && (
        <Modal title="Log progress" onClose={closeForm}>
          <ProgressForm
            defaultType={metric}
            isPending={createMetric.isPending}
            error={createMetric.isError ? getErrorMessage(createMetric.error) : undefined}
            onCancel={closeForm}
            onSubmit={(values) =>
              createMetric.mutate(toCreateRequest(values), {
                onSuccess: () => {
                  closeForm()
                  setParams({ metric: values.metricType }, { replace: true })
                },
              })
            }
          />
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete entry?"
          message={`${formatValue(toDelete.metricType, toDelete.value)} from ${formatDateTime(toDelete.recordedAt)} will be permanently deleted.`}
          isPending={deleteMetric.isPending}
          error={deleteMetric.isError ? getErrorMessage(deleteMetric.error) : undefined}
          onCancel={closeDelete}
          onConfirm={() => deleteMetric.mutate(toDelete.id, { onSuccess: closeDelete })}
        />
      )}
    </div>
  )
}
