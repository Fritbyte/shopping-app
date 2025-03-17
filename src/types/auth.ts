export type Role = "USER" | "ADMIN"

export interface BaseUser {
    username: string
    email: string
    role: Role
}

export interface User extends BaseUser {
    id?: number
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface RegisterCredentials extends LoginCredentials {
  email: string
  confirmPassword: string
}

export interface AuthResponse {
  token: string
  user: User
}