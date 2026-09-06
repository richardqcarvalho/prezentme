import { DEFAULT_INFORMATIONS } from "@/data/information";
import { InformationStoreT } from "@/types/information";
import { PageStoreT } from "@/types/page";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const pageStore = create<PageStoreT>()(
  persist(
    (set) => ({
      page: 0,
      setPage: (page) => set({ page }),
    }),
    { name: "prezentme-page", version: 1 },
  ),
);

export const informationStore = create<InformationStoreT>()(
  persist(
    (set) => ({
      ...DEFAULT_INFORMATIONS,
      setInformation: (informations) => set(informations),
    }),
    { name: "prezentme-information", version: 1 },
  ),
);
