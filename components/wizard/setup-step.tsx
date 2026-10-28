"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { SetupDraft } from "@/components/wizard/draft";

export function SetupStep({
  value,
  onChange,
  onBack,
  onFinish,
}: {
  value: SetupDraft;
  onChange: (patch: Partial<SetupDraft>) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onFinish();
      }}
      className="grid gap-6"
    >
      <div className="grid gap-2">
        <Label htmlFor="name">Setup name</Label>
        <Input
          id="name"
          value={value.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. My developer portfolio"
          maxLength={100}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={value.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="What should we generate for you?"
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Finish</Button>
      </div>
    </form>
  );
}
