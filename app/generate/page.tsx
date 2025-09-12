"use client";

import PersonalInformation from "@/components/form/1-personal-information";
import Contact from "@/components/form/2-contact";
import Language from "@/components/form/3-language";
import Experience from "@/components/form/4-experience";
import { pageStore } from "@/store";

export default function Generate() {
  const { page } = pageStore();
  const pages = [
    <PersonalInformation />,
    <Contact />,
    <Language />,
    <Experience />,
  ];

  return pages[page];
}
