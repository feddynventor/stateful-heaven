import { UserPayload } from '../entities/user'
import { NewUserParams, VerifyUserParams } from '../schemas/user.schema'

export interface IUserRepository {
  getUser: (user_id: string) => Promise<UserPayload>
  deleteUser: (user_id: string, farmacia_uuid?: string) => Promise<void>
  createUser: (u: NewUserParams) => Promise<string>
  verifyUser: (u: VerifyUserParams) => Promise<string>
  listUsers: () => Promise<UserPayload[]>
}
