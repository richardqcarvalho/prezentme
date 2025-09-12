import { DEFAULT_INFORMATIONS } from "@/data/information";
import { InformationStoreT } from "@/types/information";
import { PageStoreT } from "@/types/page";
import { create } from "zustand";

export const pageStore = create<PageStoreT>((set) => ({
  page: 0,
  setPage: (page) => set({ page }),
}));

export const informationStore = create<InformationStoreT>((set) => ({
  ...DEFAULT_INFORMATIONS,
  setInformation: (informations) => set({ ...informations }),
}));
