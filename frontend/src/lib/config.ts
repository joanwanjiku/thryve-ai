export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

/** Full-page navigation target that starts the backend's Google OIDC flow. */
export const GOOGLE_LOGIN_URL = `${API_BASE_URL}/oauth2/authorization/google`
