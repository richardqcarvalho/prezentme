import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, Ref } from "react";

type Variant = "primary" | "secondary";
type Size = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variantStyles: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-black/70 border border-transparent",
  secondary: "bg-white text-black hover:bg-black/5 border border-black/20",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: Props & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={props.ref}
      type={type}
      className={cn([
        "flex cursor-pointer items-center justify-center gap-2 rounded-lg disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ])}
      {...props}
    />
  );
}
