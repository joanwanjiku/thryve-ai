import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProgressMetric, deleteProgressMetric, fetchMetricHistory } from './api'
import type { MetricType } from './types'

// Every progress query lives under this prefix so one invalidation refreshes history and latest values.
export const progressKeys = {
  all: ['progress'] as const,
  history: (type: MetricType) => [...progressKeys.all, 'history', type] as const,
}

export function useMetricHistory(type: MetricType) {
  return useQuery({ queryKey: progressKeys.history(type), queryFn: () => fetchMetricHistory(type) })
}

function useInvalidateProgress() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: progressKeys.all })
}

export function useCreateProgressMetric() {
  const onSuccess = useInvalidateProgress()
  return useMutation({ mutationFn: createProgressMetric, onSuccess })
}

export function useDeleteProgressMetric() {
  const onSuccess = useInvalidateProgress()
  return useMutation({ mutationFn: deleteProgressMetric, onSuccess })
}
