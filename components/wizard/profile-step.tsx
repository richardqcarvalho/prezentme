"use client";

import { ProfileForm } from "@/components/profile-form";
import type { ProfileDraft } from "@/components/wizard/draft";

type ProfileStepProps = {
  value: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
  onNext: () => void;
};

export function ProfileStep({ value, onChange, onNext }: ProfileStepProps) {
  return <ProfileForm value={value} onChange={onChange} submitLabel="Next" onNext={onNext} />;
}
