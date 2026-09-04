import { DEFAULT_INFORMATIONS } from "@/data/information";
import { InformationStoreT, InformationsT } from "@/types/information";
import { PageStoreT } from "@/types/page";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Versioned so future schema changes can migrate stored user data instead of
// silently dropping it on load.
const INFORMATION_STORE_VERSION = 1;

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
      // Merge partial updates into the existing state so callers that submit a
      // subset (e.g. only `{ language }`) don't wipe the other fields.
      setInformation: (informations) =>
        set((state) => ({ ...state, ...informations })),
    }),
    {
      name: "prezentme-information",
      storage: createJSONStorage(() => localStorage),
      version: INFORMATION_STORE_VERSION,
      // Only persist data fields; `setInformation` is a function and would be
      // dropped by JSON serialization anyway, but excluding it makes the intent
      // explicit and future-proofs against adding more non-data fields.
      partialize: (state) => {
        const { setInformation, ...data } = state;
        void setInformation;
        return data;
      },
      // No migrations yet; bump `INFORMATION_STORE_VERSION` and add a branch
      // here when the `InformationsT` shape changes.
      migrate: (persistedState) => persistedState as InformationsT,
    },
  ),
);
