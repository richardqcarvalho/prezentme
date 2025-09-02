"use client";

import { generateHTML } from "@/app/informations/actions";
import Button from "@/components/button";
import Input from "@/components/input";
import { DEFAULT_INFORMATIONS } from "@/data/information";
import { cn } from "@/lib/utils";
import { ButtonStateT } from "@/model/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  role: z.string().nonempty(),
  birthDate: z.string().nonempty(),
  number: z.string().nonempty(),
  location: z.string().nonempty(),
  email: z.string().nonempty(),
  language: z.array(z.any()),
  experience: z.array(z.any()),
  education: z.array(z.any()),
  project: z.array(z.any()),
  setup: z.array(z.any()),
});

export default function Informations() {
  const [buttonState, setButtonState] = useState<ButtonStateT>("initial");
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_INFORMATIONS,
    disabled: buttonState !== "initial",
  });

  function getButtonText() {
    switch (buttonState) {
      case "generated":
        return "Generated";
      case "generating":
        return "Generating";
      default:
        return "Generate";
    }
  }

  async function onSubmit(informations: z.infer<typeof formSchema>) {
    setButtonState("generating");
    const HTML = await generateHTML(informations);
    const url = window.URL.createObjectURL(HTML);
    const a = document.createElement("a");

    a.href = url;
    a.setAttribute("download", "index.html");
    a.click();

    setButtonState("generated");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-[24rem] flex-col items-center gap-4 p-8 lg:w-[48rem]"
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
        placeholder="Tell us your contact number"
        label="Number"
        {...register("number")}
      />
      <Input
        placeholder="Where do you live?"
        label="Location"
        {...register("location")}
      />
      <Input
        placeholder="Type your best e-mail"
        label="Email"
        {...register("email")}
      />
      <div className="mt-2 flex flex-col gap-2">
        <Button
          type="submit"
          className={cn({
            "bg-green-600": buttonState === "generated",
          })}
          disabled={buttonState !== "initial" || !isValid}
        >
          <span>{getButtonText()}</span>
          {buttonState === "generated" && <Check />}
        </Button>
        {buttonState === "generated" && (
          <Button onClick={() => setButtonState("initial")}>
            <span>Edit</span>
          </Button>
        )}
      </div>
    </form>
  );
}
