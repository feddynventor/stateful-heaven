import { QueryResult } from 'pg'
import { User, UserPayload } from '../entities/user'

export interface IUserRepository {
  createUser: (userPayload: UserPayload) => Promise<boolean | null>
  getUser: (id: string) => Promise<User | null>
}
