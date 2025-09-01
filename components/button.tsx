import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn([
        "flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-black/90 disabled:pointer-events-none disabled:opacity-50",
        props.className,
      ])}
    />
  );
}
