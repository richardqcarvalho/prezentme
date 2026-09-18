"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { RepeatableFieldGroup } from "@/components/repeatable-field-group";
import { useAutoPersist } from "@/hooks/use-auto-persist";
import { DEFAULT_INFORMATIONS } from "@/data/information";
import { CONTACT_PAGE, EXPERIENCE_PAGE } from "@/lib/constants";
import { informationStore, pageStore } from "@/store";
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
    watch,
    formState: { errors, isValid },
  } = useForm<LanguageFormValues>({
    defaultValues: { language },
    mode: "onChange",
    resolver: zodResolver(languageSchema),
  });

  useAutoPersist(watch, (values) => values);
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
      className="w-form flex flex-col items-center gap-8 p-8"
    >
      {fields.map((field, index) => (
        <RepeatableFieldGroup
          key={field.id}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
        >
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
        </RepeatableFieldGroup>
      ))}
      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          onClick={() => append(DEFAULT_INFORMATIONS.language[0])}
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
