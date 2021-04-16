import { User, UserRole } from "./User";
import { WinstormEnclosed } from "./WinstromEnclosed";

interface UserDetailResponseRaw {
  id: number;
  kod: string;
  jmeno: string;
  prijmeni: string;
  role: string;
  email: string;
}

export type UserDetailResponse = WinstormEnclosed<UserDetailResponseRaw[]>;

export const userDetailResponseToUser = (detail: UserDetailResponse): User => {
  const roleString: string =
    detail.winstrom[0].role.split(":code")[1] || "JENCIST";

  return {
    email: detail.winstrom[0].email,
    lastname: detail.winstrom[0].prijmeni,
    username: detail.winstrom[0].kod,
    name: detail.winstrom[0].jmeno,
    role: UserRole[roleString as keyof typeof UserRole],
  };
};
