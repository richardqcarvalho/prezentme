import { cn } from "@/lib/utils";
import { InputHTMLAttributes, useId } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function Input({
  label,
  error,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const describedBy = [ariaDescribedBy, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId}>{label}</label>
      <input
        {...props}
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid ?? Boolean(error)}
        className={cn(
          "w-full rounded-lg border px-4 py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        id={inputId}
      />
      {error && (
        <p className="text-sm text-red-600" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
