import createStorage from "utils/createStorage";
import create, { State } from "zustand";
import { configurePersist } from "zustand-persist";

const { persist } = configurePersist({
  storage: createStorage(),
});

interface General {
  heading: string;
}

interface Actions {
  setHeading: (newHeading: string) => void;
}

export type UserState = General & State & Actions;

const useGeneralStore = create<UserState>(
  persist(
    {
      key: "general",
    },
    (set) => ({
      heading: "",
      setHeading: (newHeading) => set({ heading: newHeading }),
    })
  )
);

export default useGeneralStore;
