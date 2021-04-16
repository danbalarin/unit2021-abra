import createStorage from "utils/createStorage";
import { createGetUserDetails, createLogout } from "utils/networking";
import create, { State } from "zustand";
import { configurePersist } from "zustand-persist";

import { User, UserRole } from "../models/User";

const { persist } = configurePersist({
  storage: createStorage(),
});

interface Actions {
  login: (user: Partial<User>) => void;
  logout: () => void;
  setSessionId: (sessionId: string) => void;
}

export type UserState = User & State & Actions;

const EMPTY_USER: User = {
  email: "",
  lastname: "",
  name: "",
  role: UserRole.JENCIST,
  username: "",
  sessionId: "",
  isLogged: false,
};

const useUserStore = create<UserState>(
  persist(
    {
      key: "auth",
    },
    (set, get) => ({
      ...EMPTY_USER,
      login: async (user) => {
        set(() => ({ ...get(), isLogged: true, ...user }));
        // if (!get().isLogged) {
        //   createGetUserDetails(get);
        // }
      },
      logout: async () => {
        createLogout(get);
        set(
          (state) => ({
            ...EMPTY_USER,
            login: state.login,
            logout: state.logout,
            setSessionId: state.setSessionId,
          }),
          true
        );
      },
      setSessionId: async (sessionId) => {
        set(() => ({ sessionId }));
        await createGetUserDetails(get);
      },
    })
  )
);

export default useUserStore;
