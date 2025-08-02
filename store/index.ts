import { inputStoreT, pageStoreT } from "@/types";
import { create } from "zustand";

export const pageStore = create<pageStoreT>((set) => ({
  page: 0,
  setPage: (page) => set({ page }),
}));

export const inputStore = create<inputStoreT>((set) => ({
  setInputValue: (id: string, value: string) =>
    set({
      [id]: value,
    }),
}));
