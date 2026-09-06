"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { LANGUAGE_PAGE, PERSONAL_INFORMATIONS_PAGE } from "@/lib/constants";
import { informationStore, pageStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const contactSchema = z.object({
  gitHub: z.url("Enter a valid GitHub URL."),
  linkedIn: z.url("Enter a valid LinkedIn URL."),
  number: z.string().trim().min(1, "Enter a contact number."),
  email: z.email("Enter a valid email address."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Page() {
  const { setInformation, gitHub, linkedIn, number, email } =
    informationStore();
  const { setPage } = pageStore();
  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<ContactFormValues>({
    defaultValues: { gitHub, linkedIn, number, email },
    mode: "onChange",
    resolver: zodResolver(contactSchema),
  });

  function onSubmit(informations: ContactFormValues) {
    setInformation(informations);
    setPage(LANGUAGE_PAGE);
  }

  function goBack() {
    setInformation(getValues());
    setPage(PERSONAL_INFORMATIONS_PAGE);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-8 p-8"
    >
      <div className="flex w-full flex-col gap-8 rounded-lg border border-black/20 p-8">
        <Input
          error={errors.gitHub?.message}
          label="GitHub"
          placeholder="https://github.com/username"
          type="url"
          {...register("gitHub")}
        />
        <Input
          error={errors.linkedIn?.message}
          label="LinkedIn"
          placeholder="https://linkedin.com/in/username"
          type="url"
          {...register("linkedIn")}
        />
        <Input
          error={errors.number?.message}
          label="Number"
          placeholder="Tell us your contact number"
          type="tel"
          {...register("number")}
        />
        <Input
          error={errors.email?.message}
          label="Email"
          placeholder="Type your best email"
          type="email"
          {...register("email")}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={goBack} type="button">
          <span>Back</span>
        </Button>
        <Button type="submit" disabled={!isValid}>
          <span>Next</span>
        </Button>
      </div>
    </form>
  );
}

export const pageId = "contact";
