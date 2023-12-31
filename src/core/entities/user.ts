export enum Role {
  ADMIN, //"0"
  EDITOR,
  READONLY
}
export interface User {
  uuid: string
  email: string
  password: string
  fullname: string
  role: Role
};

export type UserPayload = Omit<User, 'uuid'|'password'>

export interface UserToken {
  payload: {uuid: string},
  user: UserPayload,
  iat: number
}

export class User implements User {
  constructor(obj: UserPayload){
    Object.assign(this, obj)
  }
}