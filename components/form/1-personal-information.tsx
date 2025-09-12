"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { CONTACT_PAGE } from "@/lib/constants";
import { informationStore, pageStore } from "@/store";
import { personalInfoSchema, PersonalInfoT } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function PersonalInformation() {
  const { setInformation, firstName, lastName, role, location } =
    informationStore();
  const { setPage } = pageStore();
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<PersonalInfoT>({
    resolver: zodResolver(personalInfoSchema),
    values: {
      firstName,
      lastName,
      role,
      location,
    },
  });

  async function onSubmit(informations: PersonalInfoT) {
    setInformation(informations);
    setPage(CONTACT_PAGE);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-8 p-8"
    >
      <div className="flex w-full flex-col gap-8 rounded-lg border border-black/20 p-8">
        <Input
          placeholder="What's your first name?"
          label="First name"
          {...register("firstName")}
        />
        <Input
          placeholder="What's your last name?"
          label="Last name"
          {...register("lastName")}
        />
        <Input
          placeholder="What's your role?"
          label="Role"
          {...register("role")}
        />
        <Input
          placeholder="Where do you live?"
          label="Location"
          {...register("location")}
        />
      </div>
      <Button type="submit" disabled={!isValid}>
        <span>Next</span>
      </Button>
    </form>
  );
}
