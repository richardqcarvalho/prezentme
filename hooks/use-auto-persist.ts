"use client";

import { informationStore } from "@/store";
import { InformationsT, InformationStoreT } from "@/types/information";
import { useEffect, useRef } from "react";
import type { FieldValues, UseFormWatch } from "react-hook-form";

const AUTOSAVE_DEBOUNCE_MS = 500;

export function useAutoPersist<TFields extends FieldValues>(
  watch: UseFormWatch<TFields>,
  toInformations: (values: TFields) => Partial<InformationsT>,
) {
  const setInformation = informationStore(
    (state: InformationStoreT) => state.setInformation,
  );
  const toInformationsRef = useRef(toInformations);
  toInformationsRef.current = toInformations;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setInformation(toInformationsRef.current(values as TFields));
      }, AUTOSAVE_DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutRef.current);
    };
  }, [watch, setInformation]);
}