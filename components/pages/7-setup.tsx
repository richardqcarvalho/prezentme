"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/text-area";
import { DEFAULT_INFORMATIONS } from "@/data/information";
import { PROJECT_PAGE, REVIEW_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { informationStore, pageStore } from "@/store";
import { setupSchema, SetupT } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

export function Page() {
  const { setInformation, setup } = informationStore();
  const { setPage } = pageStore();
  const {
    control,
    getValues,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<SetupT>({
    defaultValues: { setup },
    mode: "onChange",
    resolver: zodResolver(setupSchema),
  });
  const { fields, append, remove } = useFieldArray({ control, name: "setup" });

  function onSubmit(informations: SetupT) {
    setInformation(informations);
    setPage(REVIEW_PAGE);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-[26rem] flex-col items-center gap-8 p-8"
    >
      {fields.map((field, index) => (
        <div
          className="flex w-full flex-col gap-8 rounded-lg border border-black/20 p-8"
          key={field.id}
        >
          <div className="flex w-full justify-end">
            <button
              aria-label="Remove setup item"
              className={cn(
                "cursor-pointer text-red-500 hover:text-red-500/70",
                { "pointer-events-none text-red-500/70": fields.length === 1 },
              )}
              onClick={() => remove(index)}
              type="button"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
          <Input
            error={errors.setup?.[index]?.name?.message}
            label="Item"
            placeholder="MacBook Pro, Monitor, Camera..."
            {...register(`setup.${index}.name`)}
          />
          <TextArea
            error={errors.setup?.[index]?.specs?.message}
            label="Specifications"
            placeholder="Describe the model, configuration, or key details"
            {...register(`setup.${index}.specs`)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => append(DEFAULT_INFORMATIONS.setup[0])}
          type="button"
        >
          Add setup item
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setInformation(getValues());
              setPage(PROJECT_PAGE);
            }}
            type="button"
          >
            Back
          </Button>
          <Button disabled={!isValid} type="submit">
            Review
          </Button>
        </div>
      </div>
    </form>
  );
}

export const pageId = "setup";
