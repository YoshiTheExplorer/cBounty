import { create } from "zustand";

export const useTaskManagerStore  = create<{
    viewMainPage: boolean;
    currentTaskManagerAddress: string | null;
    setViewMainPage: (value: boolean) => void;
    setCurrentTaskManagerAddress: (address: string | null) => void;
  }>((set) => ({
    viewMainPage: false,
    currentTaskManagerAddress: null,
    setViewMainPage: (value) => set({ viewMainPage: value }),
    setCurrentTaskManagerAddress: (address) => set({ currentTaskManagerAddress: address }),
  }));