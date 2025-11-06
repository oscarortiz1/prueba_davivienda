import { AuthRepository, RegisterDTO } from '../adapters/AuthRepository'
import { User } from '../domain/User'

export function makeAuthUseCases(repo: AuthRepository) {
  async function register(dto: RegisterDTO): Promise<User> {
    if (!dto.email || !dto.password || !dto.name) throw new Error('Todos los campos son obligatorios')
    return repo.register(dto)
  }

  async function login(email: string, password: string): Promise<User> {
    if (!email || !password) throw new Error('Email y password son requeridos')
    return repo.login(email, password)
  }

  async function logout(): Promise<void> {
    return repo.logout()
  }

  async function current(): Promise<User | null> {
    return repo.getCurrent()
  }

  return { register, login, logout, current }
}
