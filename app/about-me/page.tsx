"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { informationStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  role: z.string().nonempty(),
  birthDate: z.string().nonempty(),
  location: z.string().nonempty(),
});

export default function AboutMe() {
  const router = useRouter();
  const { setInformation, firstName, lastName, role, birthDate, location } =
    informationStore();
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      firstName,
      lastName,
      role,
      birthDate,
      location,
    },
  });

  async function onSubmit(informations: z.infer<typeof formSchema>) {
    setInformation(informations);
    router.push("/contact");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-4 p-8"
    >
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
        placeholder="When did you have birth?"
        label="Birth date"
        type="date"
        {...register("birthDate")}
      />
      <Input
        placeholder="Where do you live?"
        label="Location"
        {...register("location")}
      />
      <Button type="submit" disabled={!isValid} className="mt-4">
        <span>Next</span>
      </Button>
    </form>
  );
}
