"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { InputHTMLAttributes } from "react";

export default function CompleteInput({
  id,
  placeholder,
  label,
  onChange,
  value,
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        placeholder={placeholder}
        id={id}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}
