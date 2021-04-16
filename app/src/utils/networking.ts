import ky from "ky";
import {
  UserDetailResponse,
  userDetailResponseToUser,
} from "models/UserDetailResponse";
import useUserStore, { UserState } from "state/user";
import { GetState } from "zustand";

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

export const createGetUserDetails = async (get: GetState<UserState>) => {
  try {
    const response = await kyInstance
      .get(
        "c/rezervace5/uzivatel/(id=me())?detail=custom:kod,jmeno,prijmeni,role,email"
      )
      .json<UserDetailResponse>();
    get().login(userDetailResponseToUser(response));
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
