export interface User {
  uuid: string
  password: string
  fullname: string
  cf: string
};
export type UserPayload = Omit<User, 'uuid'|'password'>