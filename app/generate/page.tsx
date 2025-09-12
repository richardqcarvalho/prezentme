"use client";

import * as personalInformation from "@/components/pages/1-personal-information";
import * as contact from "@/components/pages/2-contact";
import * as language from "@/components/pages/3-language";
import * as experience from "@/components/pages/4-experience";
import { pageStore } from "@/store";

export default function Generate() {
  const { page } = pageStore();
  const pages = [personalInformation, contact, language, experience].map(
    ({ Page, pageId }) => <Page key={pageId} />,
  );

  return pages[page];
}
