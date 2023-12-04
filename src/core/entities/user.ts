export enum Role {
  Admin, //"0"
  Editor,
  ReadOnly
}
export interface User {
  uuid: string
  password: string
  fullname: string
  cf: string
  role: Role
};
export type UserPayload = Omit<User, 'uuid'|'password'>
export type UserTokenVerification = Omit<User, 'password'>