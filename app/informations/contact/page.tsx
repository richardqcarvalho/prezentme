"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { informationStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  number: z.string().nonempty(),
  email: z.string().nonempty(),
});

export default function Contact() {
  const router = useRouter();
  const { setInformation, number, email } = informationStore();
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      number,
      email,
    },
  });

  async function onSubmit(informations: z.infer<typeof formSchema>) {
    setInformation(informations);
    router.push("/informations/language");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[26rem] flex-col items-center gap-4 p-8"
    >
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
      <Button type="submit" disabled={!isValid} className="mt-4">
        <span>Next</span>
      </Button>
    </form>
  );
}
