import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  canRemove: boolean;
  onRemove: () => void;
  children: ReactNode;
};

export function RepeatableFieldGroup({ canRemove, onRemove, children }: Props) {
  return (
    <div className="flex w-full flex-col gap-8 rounded-lg border border-black/20 p-8">
      <div className="flex w-full justify-end">
        <button
          type="button"
          aria-label="Remove item"
          aria-disabled={!canRemove}
          onClick={() => {
            if (canRemove) onRemove();
          }}
          className={cn(
            "rounded p-1 text-red-500 hover:text-red-500/70",
            {
              "pointer-events-none text-red-500/70": !canRemove,
            },
          )}
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
      {children}
    </div>
  );
}
