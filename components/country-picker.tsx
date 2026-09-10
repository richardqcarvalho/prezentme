"use client";

import { COUNTRIES, type CountryT } from "@/lib/country-codes";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type CountryPickerProps = {
  value: string;
  onChange: (dial: string) => void;
};

export default function CountryPicker({ value, onChange }: CountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected =
    COUNTRIES.find((country) => country.dial === value) ?? COUNTRIES[0];

  const term = query.trim().toLowerCase();
  const matches = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(term) ||
      country.dial.replace("+", "").includes(term.replace("+", "")),
  );

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function openList() {
    setQuery("");
    setHighlighted(0);
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function select(country: CountryT) {
    onChange(country.dial);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((index) => Math.min(index + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const country = matches[highlighted];
      if (country) select(country);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Country code"
        className="flex items-center gap-1 rounded-lg border border-black/20 px-3 py-2"
        onClick={() => (open ? setOpen(false) : openList())}
      >
        <span>{selected.flag}</span>
        <span>{selected.dial}</span>
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-1 flex w-64 flex-col rounded-lg border border-black/20 bg-white shadow-lg">
          <input
            ref={inputRef}
            aria-label="Search country"
            placeholder="Search country"
            className="border-b border-black/10 px-3 py-2 outline-none"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setHighlighted(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <ul className="max-h-56 overflow-y-auto" role="listbox">
            {matches.map((country, index) => (
              <li
                aria-selected={country.dial === value}
                key={`${country.name}-${country.dial}`}
                role="option"
              >
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left",
                    index === highlighted && "bg-black/5",
                  )}
                  onClick={() => select(country)}
                  onMouseEnter={() => setHighlighted(index)}
                >
                  <span>{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-black/50">{country.dial}</span>
                </button>
              </li>
            ))}
            {matches.length === 0 && (
              <li className="px-3 py-2 text-black/50">No country found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
