export type Role = 'USER' | 'ADMIN'

export interface CurrentUser {
  id: string
  email: string
  displayName: string
  profilePictureUrl?: string
  role: Role
}
