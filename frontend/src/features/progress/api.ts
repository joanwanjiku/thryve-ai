import { api, unwrap } from '../../lib/axios'
import type { ApiResponse } from '../../types/api'
import type { CreateProgressMetricRequest, MetricType, ProgressMetric } from './types'

/** All entries for one metric, newest first. */
export async function fetchMetricHistory(type: MetricType): Promise<ProgressMetric[]> {
  return unwrap(await api.get<ApiResponse<ProgressMetric[]>>(`/progress/type/${type}`))
}

export async function createProgressMetric(body: CreateProgressMetricRequest): Promise<ProgressMetric> {
  return unwrap(await api.post<ApiResponse<ProgressMetric>>('/progress', body))
}

export async function deleteProgressMetric(id: string): Promise<void> {
  await api.delete(`/progress/${id}`)
}
