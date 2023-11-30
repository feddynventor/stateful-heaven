import { QueryResult } from 'pg'
import { User, UserPayload } from '../entities/user'

export interface IUserRepository {
  createUser: (u: User) => Promise<boolean>
  verifyUser: (u: User) => Promise<UserPayload | null>
}
