"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/text-area";
import { DEFAULT_INFORMATIONS } from "@/data/information";
import { EDUCATION_PAGE, SETUP_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { informationStore, pageStore } from "@/store";
import { projectSchema, ProjectT } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

export function Page() {
  const { setInformation, project } = informationStore();
  const { setPage } = pageStore();
  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<ProjectT>({
    resolver: zodResolver(projectSchema),
    defaultValues: { project },
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "project",
  });

  function onSubmit(informations: ProjectT) {
    setInformation(informations);
    setPage(SETUP_PAGE);
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
              aria-label="Remove project"
              className={cn(
                "cursor-pointer text-red-500 hover:text-red-500/70",
                {
                  "pointer-events-none text-red-500/70": fields.length === 1,
                },
              )}
              onClick={() => remove(index)}
              type="button"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
          <Input
            error={errors.project?.[index]?.title?.message}
            label="Project title"
            placeholder="What is the project called?"
            {...register(`project.${index}.title`)}
          />
          <Input
            error={errors.project?.[index]?.url?.message}
            label="Project URL"
            placeholder="https://example.com"
            type="url"
            {...register(`project.${index}.url`)}
          />
          <TextArea
            error={errors.project?.[index]?.description?.message}
            label="Project description"
            placeholder="Describe the project"
            {...register(`project.${index}.description`)}
          />
          <Input
            error={errors.project?.[index]?.technologies?.message}
            label="Technologies"
            placeholder="React, TypeScript, Tailwind"
            defaultValue={field.technologies.join(", ")}
            onChange={(event) =>
              setValue(
                `project.${index}.technologies`,
                event.target.value
                  .split(",")
                  .map((technology) => technology.trim())
                  .filter(Boolean),
                { shouldValidate: true },
              )
            }
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => append(DEFAULT_INFORMATIONS.project[0])}
          type="button"
        >
          <span>Add project</span>
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setInformation(getValues());
              setPage(EDUCATION_PAGE);
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

export const pageId = "project";
