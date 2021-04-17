import * as Yup from "yup";

export enum UserRole {
  JENCIST, // visitor, read-only
  UZIVATEL, // basic user
  MANAGER,
  RECEPCNI,
  ADMIN,
}

export const ELEVATED_ROLES = [UserRole.RECEPCNI, UserRole.ADMIN];

export interface User {
  username: string;
  name: string;
  lastname?: string;
  email: string;
  role: UserRole;
  password?: string;
  sessionId?: string;
  isLogged?: boolean;
}

export const userLoginValidationSchema = Yup.object({
  username: Yup.string().required("Jmeno nesmi byt prazdne"),
  password: Yup.string().required("Heslo nesmi byt prazdne"),
});
