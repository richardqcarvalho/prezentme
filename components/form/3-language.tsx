"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { DEFAULT_INFORMATIONS } from "@/data/information";
import { EXPERIENCE_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { informationStore, pageStore } from "@/store";
import { LanguageT } from "@/types/form";
import { Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function Language() {
  const hasRun = useRef(false);
  const { setInformation, language } = informationStore();
  const { setPage } = pageStore();
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid },
  } = useForm<LanguageT>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "language",
  });

  useEffect(() => {
    if (!hasRun.current) {
      append(language);
      hasRun.current = true;
    }
  }, []);

  async function onSubmit(informations: LanguageT) {
    setInformation(informations);
    setPage(EXPERIENCE_PAGE);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-8 p-8"
    >
      {fields.map((field, index) => (
        <div
          className="flex w-full flex-col gap-8 rounded-lg border border-black/20 p-8"
          key={field.id}
        >
          <div className="flex w-full justify-end">
            <Trash
              className={cn(
                "h-4 w-4 cursor-pointer text-red-500 hover:text-red-500/70",
                {
                  "pointer-events-none text-red-500/70": fields.length === 1,
                },
              )}
              onClick={() => remove(index)}
            />
          </div>
          <Input
            placeholder="Which language?"
            label="Language"
            {...register(`language.${index}.name`)}
          />
          <Input
            placeholder="What your level at this?"
            label="Level"
            {...register(`language.${index}.level`)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => append(DEFAULT_INFORMATIONS.language[0])}
          type="button"
        >
          <span>Add language</span>
        </Button>
        <Button type="submit" disabled={!isValid}>
          <span>Next</span>
        </Button>
      </div>
    </form>
  );
}
