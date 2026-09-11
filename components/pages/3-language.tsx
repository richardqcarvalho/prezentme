"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { DEFAULT_INFORMATIONS } from "@/data/information";
import { CONTACT_PAGE, EXPERIENCE_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { informationStore, pageStore } from "@/store";
import { Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const languageSchema = z.object({
  language: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Enter a language"),
        level: z.string().trim().min(1, "Enter a proficiency level"),
      }),
    )
    .min(1, "Add at least one language"),
});

type LanguageFormValues = z.infer<typeof languageSchema>;

export function Page() {
  const { setInformation, language } = informationStore();
  const { setPage } = pageStore();
  const {
    control,
    getValues,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<LanguageFormValues>({
    defaultValues: { language },
    mode: "onChange",
    resolver: zodResolver(languageSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "language",
  });

  function onSubmit(informations: LanguageFormValues) {
    setInformation(informations);
    setPage(EXPERIENCE_PAGE);
  }

  function goBack() {
    setInformation(getValues());
    setPage(CONTACT_PAGE);
  }

  return (
    <form
      noValidate
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
              aria-label="Remove language"
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
            error={errors.language?.[index]?.name?.message}
            label="Language"
            placeholder="Which language?"
            {...register(`language.${index}.name`)}
          />
          <Input
            error={errors.language?.[index]?.level?.message}
            label="Level"
            placeholder="What is your level?"
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
        <div className="flex gap-2">
          <Button onClick={goBack} type="button">
            <span>Back</span>
          </Button>
          <Button type="submit" disabled={!isValid}>
            <span>Next</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

export const pageId = "language";
