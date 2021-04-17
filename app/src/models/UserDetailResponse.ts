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

export type UserDetailResponse = WinstormEnclosed<{
  uzivatel: UserDetailResponseRaw[];
}>;

const userDetailtoUser = (user: UserDetailResponseRaw): User => {
  const roleString: string = user.role.split("code:")[1] || "JENCIST";

  return {
    email: user.email,
    lastname: user.prijmeni,
    username: user.kod,
    name: user.jmeno,
    role: UserRole[roleString as keyof typeof UserRole],
  };
};

export const userDetailResponseToUser = (
  detail: UserDetailResponse
): User[] => {
  return detail.winstrom.uzivatel.map(userDetailtoUser);
};
