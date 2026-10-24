/** Envelope every backend endpoint wraps its payload in. */
export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message?: string
  data: T
  timestamp: string
}

/** Spring Data `Page` as serialised by Jackson. */
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}
