"use client";

import { PlusIcon, TrashIcon } from "lucide-react";

import type { LanguageDraft } from "@/components/wizard/draft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { FLUENCY_LEVELS } from "@/lib/constants";

const FLUENCY_LABELS: Record<string, string> = {
  native: "Native",
  fluent: "Fluent",
  advanced: "Advanced",
  intermediate: "Intermediate",
  basic: "Basic",
};

export function LanguagesStep({
  rows,
  onChange,
  onNext,
  onBack,
}: {
  rows: LanguageDraft[];
  onChange: (rows: LanguageDraft[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function addRow() {
    onChange([...rows, { language: "", fluency: "" }]);
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<LanguageDraft>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="grid gap-4"
    >
      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="language"
              value={row.language}
              onChange={(e) => updateRow(index, { language: e.target.value })}
              placeholder="e.g. English"
              maxLength={50}
              aria-label="Language"
            />
            <NativeSelect
              name="fluency"
              value={row.fluency}
              onChange={(e) => updateRow(index, { fluency: e.target.value })}
              aria-label="Fluency"
            >
              <option value="" disabled>
                Fluency
              </option>
              {FLUENCY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {FLUENCY_LABELS[level]}
                </option>
              ))}
            </NativeSelect>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRow(index)}
            aria-label="Remove language"
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
        Add language
      </Button>
      <div className="mt-2 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
