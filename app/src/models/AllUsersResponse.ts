import { User } from "./User";
import { UserDetailResponse } from "./UserDetailResponse";

export type AllUsersResponse = UserDetailResponse;

export interface AllUsersProprietaryResponse {
  data?: User[];
  success?: boolean;
}
