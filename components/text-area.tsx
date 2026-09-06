import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, useId } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export default function TextArea({
  label,
  error,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const describedBy = [ariaDescribedBy, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={textareaId}>{label}</label>
      <textarea
        {...props}
        aria-describedby={describedBy || undefined}
        aria-invalid={ariaInvalid ?? Boolean(error)}
        className={cn(
          "w-full rounded-lg border px-4 py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        id={textareaId}
      />
      {error && (
        <p className="text-sm text-red-600" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
