"use client";

import { useState } from "react";

import { NativeSelect } from "@/components/ui/native-select";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const FIRST_YEAR = 1950;
const LAST_YEAR = new Date().getFullYear() + 1;
const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => LAST_YEAR - i);

type MonthYearSelectProps = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  present?: boolean;
  onPresentChange?: (present: boolean) => void;
};

export function MonthYearSelect({
  name,
  label,
  value,
  onChange,
  present = false,
  onPresentChange,
}: MonthYearSelectProps) {
  const [initialYear = "", initialMonth = ""] = value.split("-");
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  function commit(nextMonth: string, nextYear: string) {
    setMonth(nextMonth);
    setYear(nextYear);
    if (nextMonth !== "" && nextYear !== "") {
      onChange(`${nextYear}-${nextMonth}`);
    }
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
      <input type="hidden" name={name} value={present ? "" : value} />
      <div className="grid grid-cols-2 gap-2">
        <NativeSelect
          value={month}
          disabled={present}
          onChange={(e) => commit(e.target.value, year)}
          aria-label={`${label} month`}
        >
          <option value="" disabled>
            Month
          </option>
          {MONTHS.map((label, i) => (
            <option key={label} value={String(i + 1).padStart(2, "0")}>
              {label}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect
          value={year}
          disabled={present}
          onChange={(e) => commit(month, e.target.value)}
          aria-label={`${label} year`}
        >
          <option value="" disabled>
            Year
          </option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </NativeSelect>
      </div>
      {onPresentChange && (
        <label className="flex cursor-pointer items-center gap-1.5 text-sm whitespace-nowrap text-muted-foreground">
          <input
            type="checkbox"
            checked={present}
            onChange={(e) => onPresentChange(e.target.checked)}
            className="accent-[var(--primary)]"
          />
          Present
        </label>
      )}
    </div>
  );
}
