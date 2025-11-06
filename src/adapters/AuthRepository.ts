import { User } from '../domain/User'

export type RegisterDTO = {
  name: string
  email: string
  password: string
}

export interface AuthRepository {
  register(dto: RegisterDTO): Promise<User>
  login(email: string, password: string): Promise<User>
  logout(): Promise<void>
  getCurrent(): Promise<User | null>
}
