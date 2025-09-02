import { DEFAULT_INFORMATIONS } from "@/data/information";
import { InformationsStoreT } from "@/types/information";
import { create } from "zustand";

export const informationStore = create<InformationsStoreT>((set) => ({
  ...DEFAULT_INFORMATIONS,
  setInformation: (informations) => set({ ...informations }),
}));
