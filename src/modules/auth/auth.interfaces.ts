export interface IAuthResponse {
  user: IUser
  token: string
}

export interface IUser {
  id: string
  name: string
  email: string
  role: {
    id: string
    name: string
    permissions: string[]
  }
}

export interface LoginDto {
  email: string
  password: string
}

export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMINISTRADOR',
  REVIEWER = 'REVISOR',
  CLIENT = 'CLIENTE',
  AGENT = 'AGENTE',
}

export interface RegisterDto {
  name: string
  email: string
  password: string
  role: RoleType | string // Allow string to be more flexible
}
