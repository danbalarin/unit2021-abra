export enum UserRole {
  EMPLOYEE = "code:ZAMESTNANEC",
  MANAGER = "code:MANAGER",
  ADMIN = "code:ADMIN",
  READONLY = "code:JENCIST",
}

export default class User {
  readonly id: number;
  readonly email: string;
  readonly username: string;
  readonly name: string;
  readonly role: UserRole;

  constructor(options: {
    id: number,
    email: string,
    username: string,
    name: string,
    role: UserRole,
  }) {
    Object.assign(this, options);
  }
}