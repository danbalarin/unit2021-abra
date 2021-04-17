import ky from "ky";
import {
  AllUsersProprietaryResponse,
  AllUsersResponse,
} from "models/AllUsersResponse";
import {
  UserDetailResponse,
  userDetailResponseToUser,
} from "models/UserDetailResponse";
import useUserStore, { UserState } from "state/user";
import { GetState } from "zustand";
import useRequest from "./useRequest";

export const kyInstance = ky.create({
  prefixUrl: "https://rezervace.flexibee.eu/v2/",
  hooks: {
    beforeRequest: [
      (req) => {
        const { sessionId } = useUserStore.getState();
        if (sessionId) {
          req.headers.append("X-authSessionId", sessionId);
        }
        return req;
      },
      // (req) => {
      //   const { username, password } = useUserStore.getState();
      //   console.log(username, password);
      //   if (username && password) {
      //     req.headers.append(
      //       "Authorization",
      //       `Basic ${btoa(`${username}:${password}`)}`
      //     );
      //   }
      //   return req;
      // },
      (req) => {
        req.headers.append("Content-Type", "text/plain; charset=utf-8");
        return req;
      },
    ],
  },
});

export const throwOnSoftError = async (response: any) => {
  if (response?.success === false) {
    throw new Error(response?.errors?.reason);
  }
  if (response?.winstrom?.success === false) {
    throw new Error(response?.winstrom?.errors?.reason);
  }
  return response;
};

export const createGetUserDetails = async (get: GetState<UserState>) => {
  try {
    const response = await kyInstance
      .get(
        "c/rezervace5/uzivatel/(id=me())?detail=custom:kod,jmeno,prijmeni,role,email"
      )
      .json<UserDetailResponse>();
    get().login(userDetailResponseToUser(response)[0]);
  } catch (e) {}
};

export const createLogout = async (get: GetState<UserState>) => {
  try {
    const username = get().username;
    await kyInstance
      .post(`status/user/${username}/logout`)
      .json<UserDetailResponse>();
  } catch (e) {}
};

export const useGetAllUsers = () => {
  // const request = useRequest<AllUsersResponse>(
  //   "c/rezervace5/uzivatel.json?limit=0&detail=custom:id,kod,email,prijmeni,jmeno,role"
  // );
  // return {
  //   loading: request.loading,
  //   error: request.error,
  //   response: request.response && userDetailResponseToUser(request.response),
  // };

  return useRequest<AllUsersProprietaryResponse>(
    "http://157.90.233.5:8080/users",
    { prefixUrl: "" }
  );
};
