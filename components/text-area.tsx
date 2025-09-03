import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes } from "react";

export default function TextArea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={cn([
        "w-full rounded-lg border px-4 py-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      ])}
    />
  );
}
