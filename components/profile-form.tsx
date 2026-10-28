"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import { toast } from "sonner";

import { updateProfile, type UpdateProfileState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileFormProps = {
  firstName: string | null;
  lastName: string | null;
  location: string | null;
};

const initialState: UpdateProfileState = { success: false };

export function ProfileForm({ firstName, lastName, location }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.success) toast.success("Profile saved");
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-3">
        <Label htmlFor="firstName">First name</Label>
        <Input id="firstName" name="firstName" defaultValue={firstName ?? ""} maxLength={100} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="lastName">Last name</Label>
        <Input id="lastName" name="lastName" defaultValue={lastName ?? ""} maxLength={100} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={location ?? ""}
          placeholder="e.g. Paris, France"
        />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
