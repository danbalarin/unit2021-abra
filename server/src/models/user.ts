export enum UserRole {
  EMPLOYEE = "code:ZAMESTNANEC",
  MANAGER = "code:MANAGER",
  ADMIN = "code:ADMIN",
  RECEPTIONIST = "code:RECEPCNI",
  VISITOR = "code:JENCIST",
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

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.RECEPTIONIST;
  }

  isManager(): boolean {
    return this.role === UserRole.MANAGER;
  }

  isEmployee(): boolean {
    return this.role === UserRole.EMPLOYEE;
  }

  isVisitor(): boolean {
    return this.role === UserRole.VISITOR;
  }

  toJSON(): Object {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      name: this.name,
      role: this.role,
    };
  }
}