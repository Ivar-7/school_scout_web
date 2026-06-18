import type { UserRole } from '../../../shared/types/user.types'

export type { UserRole, UserProfile } from '../../../shared/types/user.types'

export interface SignUpInput {
  displayName: string
  email: string
  password: string
  role: UserRole
  phone: string
}

export interface SignInInput {
  email: string
  password: string
}
