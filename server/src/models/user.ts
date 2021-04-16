enum UserRole {
  EMPLOYEE = "employee",
  MANAGER = "manager",
  ADMIN = "admin",
}

export default class User {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly role: UserRole,
  ) {}
}