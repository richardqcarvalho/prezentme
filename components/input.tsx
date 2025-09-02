import { InputHTMLAttributes } from "react";

export default function Input(
  props: InputHTMLAttributes<HTMLInputElement> & { label: string },
) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={props.id} className="text-[12pt]">
        {props.label}
      </label>
      <input
        id={props.id}
        className="w-full rounded-lg border px-4 py-2 text-[16pt] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
    </div>
  );
}
