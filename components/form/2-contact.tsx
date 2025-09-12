"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { LANGUAGE_PAGE } from "@/lib/constants";
import { informationStore, pageStore } from "@/store";
import { contactSchema, ContactT } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Contact() {
  const { setInformation, gitHub, linkedIn, number, email } =
    informationStore();
  const { setPage } = pageStore();
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<ContactT>({
    resolver: zodResolver(contactSchema),
    values: {
      gitHub,
      linkedIn,
      number,
      email,
    },
  });

  async function onSubmit(informations: ContactT) {
    setInformation(informations);
    setPage(LANGUAGE_PAGE);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-8 p-8"
    >
      <div className="flex w-full flex-col gap-8 rounded-lg border border-black/20 p-8">
        <Input
          placeholder="Type your GitHub"
          label="GitHub"
          {...register("gitHub")}
        />
        <Input
          placeholder="Type your LinkedIn"
          label="LinkedIn"
          {...register("linkedIn")}
        />
        <Input
          placeholder="Tell us your contact number"
          label="Number"
          {...register("number")}
        />
        <Input
          placeholder="Type your best e-mail"
          label="Email"
          {...register("email")}
        />
      </div>
      <Button type="submit" disabled={!isValid}>
        <span>Next</span>
      </Button>
    </form>
  );
}
