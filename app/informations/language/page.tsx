"use client";

import { generateHTML } from "@/app/informations/actions";
import Button from "@/components/button";
import Input from "@/components/input";
import { cn } from "@/lib/utils";
import { informationStore } from "@/store";
import { Trash } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function Language() {
  const { setInformation, language, ...rest } = informationStore();
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "language",
  });

  async function onSubmit(informations: any) {
    setInformation(informations);

    const HTML = await generateHTML({ ...informations, ...rest });
    const url = window.URL.createObjectURL(HTML);
    const a = document.createElement("a");

    a.href = url;
    a.setAttribute("download", "index.html");
    a.click();
  }

  useEffect(() => {
    append(language);
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-4 p-8"
    >
      {fields.map((field, index) => (
        <div className="flex w-full flex-col gap-4" key={field.id}>
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
      <Button onClick={() => append({ name: "", level: "" })} className="mt-4">
        <span>Add language</span>
      </Button>
      <Button type="submit" disabled={!isValid} className="mt-4">
        <span>Generate</span>
      </Button>
    </form>
  );
}
