"use client";

import * as personalInformation from "@/components/form/1-personal-information";
import * as contact from "@/components/form/2-contact";
import * as language from "@/components/form/3-language";
import * as experience from "@/components/form/4-experience";
import { pageStore } from "@/store";

export default function Generate() {
  const { page } = pageStore();
  const pages = [personalInformation, contact, language, experience].map(
    ({ Page, pageId }) => <Page key={pageId} />,
  );

  return pages[page];
}
