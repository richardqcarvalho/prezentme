"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileDraft } from "@/components/wizard/draft";

type ProfileFormProps = {
  value: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
  submitLabel?: string;
  onNext?: () => void;
};

export function ProfileForm({ value, onChange, submitLabel = "Save", onNext }: ProfileFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext?.();
      }}
      className="grid gap-6"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={value.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            maxLength={100}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={value.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            maxLength={100}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={value.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="e.g. Paris, France"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={value.role}
          onChange={(e) => onChange({ role: e.target.value })}
          placeholder="e.g. Frontend Engineer"
        />
      </div>
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
