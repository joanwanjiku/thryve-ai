import { isAxiosError } from 'axios'

/** Best human-readable message for a failed request: the backend's `ApiResponse.message` if present. */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string } | undefined)?.message
    if (message) return message
  }
  return 'Something went wrong. Please try again.'
}
