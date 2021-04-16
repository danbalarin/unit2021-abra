export enum UserRole {
    JENCIST, // visitor, read-only
    UZIVATEL, // basic user
    MANAGER,
    ADMIN, // recepcionist
}

export interface User {
    username: string;
    name: string;
    lastname: string;
    email: string;
    role: UserRole;
    sessionId?: string;
}
