import ky from "ky";
import {
  UserDetailResponse,
  userDetailResponseToUser,
} from "models/UserDetailResponse";
import useStore, { UserState } from "state/user";
import { GetState } from "zustand";

export const kyInstance = ky.create({
  prefixUrl: "https://rezervace.flexibee.eu/v2/",
  hooks: {
    beforeRequest: [
      (req) => {
        const { sessionId } = useStore.getState();
        if (sessionId) {
          req.headers.append("X-authSessionId", sessionId);
        }
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
