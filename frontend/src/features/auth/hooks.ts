import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { fetchCurrentUser } from './api'
import { clearToken, getToken } from './token'

export const currentUserKey = ['auth', 'me'] as const

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserKey,
    queryFn: fetchCurrentUser,
    enabled: getToken() !== null,
    staleTime: Infinity,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return () => {
    clearToken()
    queryClient.clear()
    navigate('/', { replace: true })
  }
}
