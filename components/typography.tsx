import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";

function H1({
  children,
  className,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h1
      className={cn([
        "text-primary scroll-m-20 text-6xl font-extrabold tracking-tight text-balance",
        className,
      ])}
    >
      {children}
    </h1>
  );
}

function H3({
  children,
  className,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h3
      className={cn([
        "text-primary scroll-m-20 text-2xl font-semibold tracking-tight",
        className,
      ])}
    >
      {children}
    </h3>
  );
}
function H4({
  children,
  className,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
  return (
    <h4
      className={cn([
        "text-primary scroll-m-20 text-xl font-semibold tracking-tight",
        className,
      ])}
    >
      {children}
    </h4>
  );
}

export { H1, H3, H4 };
