import React from "react";
import create, { State } from "zustand";

import { User, UserRole } from "../models/User";

interface Actions {
  login: (user: User) => void;
  logout: () => void;
  setSessionId: (sessionId: string) => void;
}

export type UserState = User & State & Actions;

const useStore = create<UserState>((set) => ({
  email: "",
  lastname: "",
  name: "",
  role: UserRole.JENCIST,
  username: "",
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
  setSessionId: (sessionId) => set(() => ({ sessionId })),
}));

export default useStore;
