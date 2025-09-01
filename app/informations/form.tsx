"use client";

import { generateHTML } from "@/app/informations/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DEFAULT_INFORMATIONS from "@/data/information";
import { cn } from "@/lib/utils";
import { ButtonStateT } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
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

export default function InformationsForm() {
  const [buttonState, setButtonState] = useState<ButtonStateT>("initial");
  const form = useForm<z.infer<typeof formSchema>>({
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col gap-8"
      >
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="What's your first name?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="What's your last name?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth date</FormLabel>
                <FormControl>
                  <Input
                    placeholder="When did you have birth?"
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number</FormLabel>
                <FormControl>
                  <Input placeholder="Tell us your contact number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Where do you live?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="Type your best e-mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className={cn({
              "cursor-pointer": true,
              "bg-green-600": buttonState === "generated",
            })}
            disabled={buttonState !== "initial"}
          >
            <span>{getButtonText()}</span>
            {buttonState === "generated" && <Check />}
          </Button>
          {buttonState === "generated" && (
            <Button
              className="cursor-pointer"
              onClick={() => setButtonState("initial")}
            >
              <span>Edit</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
