"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { DEFAULT_INFORMATIONS } from "@/data/information";
import { EXPERIENCE_PAGE, PROJECT_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { informationStore, pageStore } from "@/store";
import { educationSchema, EducationT } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

export function Page() {
  const { setInformation, education } = informationStore();
  const { setPage } = pageStore();
  const {
    handleSubmit,
    register,
    control,
    getValues,
    formState: { isValid },
  } = useForm<EducationT>({
    resolver: zodResolver(educationSchema),
    defaultValues: { education },
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  function onSubmit(informations: EducationT) {
    setInformation(informations);
    setPage(PROJECT_PAGE);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-8 py-8"
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
            label="Degree or qualification"
            placeholder="What did you study?"
            {...register(`education.${index}.title`)}
          />
          <Input
            label="University"
            placeholder="Where did you study?"
            {...register(`education.${index}.university`)}
          />
          <Input
            label="Start date"
            placeholder="When did you start?"
            type="month"
            {...register(`education.${index}.start`)}
          />
          <Input
            label="End date (optional)"
            placeholder="Leave empty if ongoing"
            type="month"
            {...register(`education.${index}.end`)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => append(DEFAULT_INFORMATIONS.education[0])}
          type="button"
        >
          <span>Add education</span>
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setInformation(getValues());
              setPage(EXPERIENCE_PAGE);
            }}
            type="button"
          >
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

export const pageId = "education";
