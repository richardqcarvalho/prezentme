import { InputStoreT, PageStoreT } from "@/types";
import { create } from "zustand";

export const pageStore = create<PageStoreT>((set) => ({
  page: 0,
  setPage: (page) => set({ page }),
}));

export const inputStore = create<InputStoreT>((set) => ({
  setInputValue: (id: string, value: string) =>
    set({
      [id]: value,
    }),
}));
