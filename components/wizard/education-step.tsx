"use client";

import { PlusIcon, TrashIcon } from "lucide-react";

import type { EducationDraft } from "@/components/wizard/draft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MonthYearSelect } from "@/components/ui/month-year-select";
import { NativeSelect } from "@/components/ui/native-select";
import { EDUCATION_LEVELS } from "@/lib/constants";

const LEVEL_LABELS: Record<string, string> = {
  high_school: "High school",
  bootcamp: "Bootcamp",
  associate: "Associate",
  bachelor: "Bachelor",
  master: "Master",
  phd: "PhD",
  other: "Other",
};

const emptyRow: EducationDraft = {
  degree: "",
  level: "",
  university: "",
  startDate: "",
  endDate: "",
  present: false,
};

export function EducationStep({
  rows,
  onChange,
  onNext,
  onBack,
}: {
  rows: EducationDraft[];
  onChange: (rows: EducationDraft[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function addRow() {
    onChange([...rows, { ...emptyRow }]);
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<EducationDraft>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="grid gap-6"
    >
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] gap-2">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="degree"
                value={row.degree}
                onChange={(e) => updateRow(index, { degree: e.target.value })}
                placeholder="Degree, e.g. MSc Computer Science"
                maxLength={150}
                aria-label="Degree"
              />
              <NativeSelect
                name="level"
                value={row.level}
                onChange={(e) => updateRow(index, { level: e.target.value })}
                aria-label="Education level"
              >
                <option value="" disabled>
                  Level
                </option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {LEVEL_LABELS[level]}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <Input
              name="university"
              value={row.university}
              onChange={(e) => updateRow(index, { university: e.target.value })}
              placeholder="University"
              maxLength={150}
              aria-label="University"
            />
            <div className="grid grid-cols-2 gap-2">
              <MonthYearSelect
                name="startDate"
                label="Start"
                value={row.startDate}
                onChange={(value) => updateRow(index, { startDate: value })}
              />
              <MonthYearSelect
                name="endDate"
                label="End"
                value={row.endDate}
                onChange={(value) => updateRow(index, { endDate: value })}
                present={row.present}
                onPresentChange={(present) => updateRow(index, { present })}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRow(index)}
            aria-label="Remove education entry"
          >
            <TrashIcon />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="justify-self-start"
        onClick={addRow}
      >
        <PlusIcon data-icon="inline-start" />
        Add education
      </Button>
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
