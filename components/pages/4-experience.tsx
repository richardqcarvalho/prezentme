"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/text-area";
import { DEFAULT_INFORMATIONS } from "@/data/information";
import { EDUCATION_PAGE, LANGUAGE_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { informationStore, pageStore } from "@/store";
import type { ExperienceT as ExperienceInformationT } from "@/types/information";
import { Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const experienceSchema = z.object({
  experience: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Enter a job title."),
        company: z.string().trim().min(1, "Enter a company name."),
        start: z.string().min(1, "Select a start date."),
        end: z.string(),
        description: z.string().trim().min(1, "Describe your work."),
        technologies: z
          .string()
          .trim()
          .min(1, "Enter at least one technology."),
      }),
    )
    .min(1, "Add at least one experience."),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export function Page() {
  const { setInformation, experience } = informationStore();
  const { setPage } = pageStore();
  const {
    control,
    getValues,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<ExperienceFormValues>({
    defaultValues: {
      experience: experience.map((item: ExperienceInformationT) => ({
        ...item,
        technologies: item.technologies.join(", "),
      })),
    },
    mode: "onChange",
    resolver: zodResolver(experienceSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  function onSubmit(informations: ExperienceFormValues) {
    const formattedInformation = {
      experience: informations.experience.map(({ technologies, ...item }) => ({
        ...item,
        technologies: technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),
      })),
    };

    setInformation(formattedInformation);
    setPage(EDUCATION_PAGE);
  }

  function goBack() {
    setInformation({
      experience: getValues().experience.map(({ technologies, ...item }) => ({
        ...item,
        technologies: technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),
      })),
    });
    setPage(LANGUAGE_PAGE);
  }

  return (
    <form
      noValidate
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
              aria-label="Remove experience"
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
            error={errors.experience?.[index]?.title?.message}
            label="Experience"
            placeholder="Which role did you do there?"
            {...register(`experience.${index}.title`)}
          />
          <Input
            error={errors.experience?.[index]?.company?.message}
            label="Company name"
            placeholder="Type company name"
            {...register(`experience.${index}.company`)}
          />
          <Input
            error={errors.experience?.[index]?.start?.message}
            label="Start date"
            type="month"
            {...register(`experience.${index}.start`)}
          />
          <Input
            error={errors.experience?.[index]?.end?.message}
            label="End date (optional)"
            type="month"
            {...register(`experience.${index}.end`)}
          />
          <TextArea
            error={errors.experience?.[index]?.description?.message}
            label="Description"
            placeholder="Describe your activity there"
            {...register(`experience.${index}.description`)}
          />
          <Input
            error={errors.experience?.[index]?.technologies?.message}
            label="Technologies"
            placeholder="React, TypeScript, Node.js"
            {...register(`experience.${index}.technologies`)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() =>
            append({ ...DEFAULT_INFORMATIONS.experience[0], technologies: "" })
          }
          type="button"
        >
          <span>Add experience</span>
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

export const pageId = "experience";
