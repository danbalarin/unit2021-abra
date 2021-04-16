import createStorage from "utils/createStorage";
import { createGetUserDetails } from "utils/networking";
import create, { State } from "zustand";
import { configurePersist } from "zustand-persist";

import { User, UserRole } from "../models/User";

const { persist } = configurePersist({
  storage: createStorage(),
});

interface Actions {
  login: (user: User) => void;
  logout: () => void;
  setSessionId: (sessionId: string) => void;
}

export type UserState = User & State & Actions;

const useUserStore = create<UserState>(
  persist(
    {
      key: "auth",
    },
    (set, get) => ({
      email: "",
      lastname: "",
      name: "",
      role: UserRole.JENCIST,
      username: "",
      sessionId: "",
      login: (user) => set(() => ({ ...user })),
      logout: () =>
        set(
          (state) => ({
            login: state.login,
            logout: state.logout,
            setSessionId: state.setSessionId,
          }),
          true
        ),
      setSessionId: (sessionId) => {
        createGetUserDetails(get);
        set(() => ({ sessionId }));
      },
    })
  )
);

export default useUserStore;
