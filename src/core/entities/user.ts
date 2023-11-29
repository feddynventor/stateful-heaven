export interface User {
  uuid: string
  fullname?: string | null
  cf?: string | null
};
export type UserPayload = Omit<User, 'id'>