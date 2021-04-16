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

export const userDetailResponseToUser = (detail: UserDetailResponse): User => {
  const roleString: string =
    detail.winstrom.uzivatel[0].role.split("code:")[1] || "JENCIST";

  return {
    email: detail.winstrom.uzivatel[0].email,
    lastname: detail.winstrom.uzivatel[0].prijmeni,
    username: detail.winstrom.uzivatel[0].kod,
    name: detail.winstrom.uzivatel[0].jmeno,
    role: UserRole[roleString as keyof typeof UserRole],
  };
};
