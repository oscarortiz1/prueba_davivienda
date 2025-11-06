import { AuthRepository, RegisterDTO } from '../adapters/AuthRepository'
import { User } from '../domain/User'

const USERS_KEY = 'pd_users_v1'
const CURRENT_KEY = 'pd_current_v1'

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY) || '[]'
    return JSON.parse(raw) as User[]
  } catch {
    return []
  }
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export class MockAuthService implements AuthRepository {
  async register(dto: RegisterDTO): Promise<User> {
    const users = readUsers()
    const exists = users.find(u => u.email.toLowerCase() === dto.email.toLowerCase())
    if (exists) throw new Error('Email ya registrado')

    const user: User = {
      id: Date.now().toString(),
      name: dto.name,
      email: dto.email,

      password: dto.password,
    }
    users.push(user)
    writeUsers(users)
    localStorage.setItem(CURRENT_KEY, user.id)

    const { password, ...safe } = user
    return safe as User
  }

  async login(email: string, password: string): Promise<User> {
    const users = readUsers()
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!user) throw new Error('Credenciales inválidas')
    localStorage.setItem(CURRENT_KEY, user.id)
    const { password: _p, ...safe } = user
    return safe as User
  }

  async logout(): Promise<void> {
    localStorage.removeItem(CURRENT_KEY)
  }

  async getCurrent(): Promise<User | null> {
    const id = localStorage.getItem(CURRENT_KEY)
    if (!id) return null
    const users = readUsers()
    const user = users.find(u => u.id === id) || null
    if (!user) return null
    const { password: _p, ...safe } = user
    return safe as User
  }
}
