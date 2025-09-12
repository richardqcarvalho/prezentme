"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import TextArea from "@/components/text-area";
import { DEFAULT_INFORMATIONS, generateHTML } from "@/data/information";
import { cn } from "@/lib/utils";
import { informationStore } from "@/store";
import { ExperienceT } from "@/types/form";
import { Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function Experience() {
  const hasRun = useRef(false);
  const { setInformation, experience, ...rest } = informationStore();
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid },
  } = useForm<ExperienceT>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  useEffect(() => {
    if (!hasRun.current) {
      append(experience);
      hasRun.current = true;
    }
  }, []);

  async function onSubmit(informations: ExperienceT) {
    setInformation(informations);

    const HTML = await generateHTML({ ...informations, ...rest });
    const url = window.URL.createObjectURL(HTML);
    const a = document.createElement("a");

    a.href = url;
    a.setAttribute("download", "index.html");
    a.click();
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
            placeholder="Which role did you do there?"
            label="Experience"
            {...register(`experience.${index}.title`)}
          />
          <Input
            placeholder="Type company name"
            label="Company name"
            {...register(`experience.${index}.company`)}
          />
          <Input
            placeholder="When did you start?"
            label="Start date"
            type="month"
            {...register(`experience.${index}.start`)}
          />
          <Input
            placeholder="When did it have end?"
            label="End date"
            type="month"
            {...register(`experience.${index}.end`)}
          />
          <TextArea
            className="mt-4"
            placeholder="Describe your activity there"
            {...register(`experience.${index}.description`)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => append(DEFAULT_INFORMATIONS.experience[0])}
          type="button"
        >
          <span>Add experience</span>
        </Button>
        <Button type="submit" disabled={!isValid}>
          <span>Generate</span>
        </Button>
      </div>
    </form>
  );
}
