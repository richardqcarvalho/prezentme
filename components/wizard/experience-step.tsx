"use client";

import { PlusIcon, TrashIcon } from "lucide-react";

import type { ExperienceDraft } from "@/components/wizard/draft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MonthYearSelect } from "@/components/ui/month-year-select";
import { Textarea } from "@/components/ui/textarea";

const emptyRow: ExperienceDraft = {
  role: "",
  company: "",
  description: "",
  startDate: "",
  endDate: "",
  present: false,
  technologies: "",
};

export function ExperienceStep({
  rows,
  onChange,
  onNext,
  onBack,
}: {
  rows: ExperienceDraft[];
  onChange: (rows: ExperienceDraft[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function addRow() {
    onChange([...rows, { ...emptyRow }]);
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }

  function updateRow(index: number, patch: Partial<ExperienceDraft>) {
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
                name="role"
                value={row.role}
                onChange={(e) => updateRow(index, { role: e.target.value })}
                placeholder="Role, e.g. Frontend Engineer"
                maxLength={150}
                aria-label="Role"
              />
              <Input
                name="company"
                value={row.company}
                onChange={(e) => updateRow(index, { company: e.target.value })}
                placeholder="Company"
                maxLength={150}
                aria-label="Company"
              />
            </div>
            <Textarea
              name="description"
              value={row.description}
              onChange={(e) => updateRow(index, { description: e.target.value })}
              placeholder="What did you do there?"
              aria-label="Description"
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
            <Input
              name="technologies"
              value={row.technologies}
              onChange={(e) => updateRow(index, { technologies: e.target.value })}
              placeholder="Technologies, comma-separated (e.g. React, TypeScript)"
              aria-label="Technologies"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRow(index)}
            aria-label="Remove experience entry"
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
        Add experience
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
