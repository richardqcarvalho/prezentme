"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { CONTACT_PAGE } from "@/lib/constants";
import { informationStore, pageStore } from "@/store";
import { personalInfoSchema, PersonalInfoT } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function Page() {
  const { setInformation, firstName, lastName, role, location } =
    informationStore();
  const { setPage } = pageStore();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<PersonalInfoT>({
    defaultValues: { firstName, lastName, role, location },
    mode: "onChange",
    resolver: zodResolver(personalInfoSchema),
  });

  function onSubmit(informations: PersonalInfoT) {
    setInformation(informations);
    setPage(CONTACT_PAGE);
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-8 p-8"
    >
      <div className="flex w-full flex-col gap-8 rounded-lg border border-black/20 p-8">
        <Input
          error={errors.firstName?.message}
          label="First name"
          placeholder="What's your first name?"
          {...register("firstName")}
        />
        <Input
          error={errors.lastName?.message}
          label="Last name"
          placeholder="What's your last name?"
          {...register("lastName")}
        />
        <Input
          error={errors.role?.message}
          label="Role"
          placeholder="What's your role?"
          {...register("role")}
        />
        <Input
          error={errors.location?.message}
          label="Location"
          placeholder="Where do you live?"
          {...register("location")}
        />
      </div>
      <Button type="submit" disabled={!isValid}>
        <span>Next</span>
      </Button>
    </form>
  );
}

export const pageId = "personal-information";
