const TOKEN_KEY = 'thryve.token'

// sessionStorage can throw (private mode, blocked storage); treat that as "no token".
export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Nothing to fall back to; the next API call will 401 and send the user to login.
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}
