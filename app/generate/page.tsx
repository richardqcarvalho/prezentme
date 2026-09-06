"use client";

import * as personalInformation from "@/components/pages/1-personal-information";
import * as contact from "@/components/pages/2-contact";
import * as language from "@/components/pages/3-language";
import * as experience from "@/components/pages/4-experience";
import * as education from "@/components/pages/5-education";
import * as project from "@/components/pages/6-project";
import * as setup from "@/components/pages/7-setup";
import * as review from "@/components/pages/7-review";
import { useEffect, useState } from "react";
import { PERSONAL_INFORMATIONS_PAGE } from "@/lib/constants";
import { informationStore, pageStore } from "@/store";
import { PageStoreT } from "@/types/page";

const steps = [
  { title: "Personal information", module: personalInformation },
  { title: "Contact", module: contact },
  { title: "Languages", module: language },
  { title: "Experience", module: experience },
  { title: "Education", module: education },
  { title: "Projects", module: project },
  { title: "Setup", module: setup },
  { title: "Review", module: review },
];

export default function Generate() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const page = pageStore((state: PageStoreT) => state.page);
  const setPage = pageStore((state: PageStoreT) => state.setPage);
  const step = steps[page];

  useEffect(() => {
    const updateHydrationState = () => {
      setHasHydrated(
        pageStore.persist.hasHydrated() &&
          informationStore.persist.hasHydrated(),
      );
    };

    updateHydrationState();
    const unsubscribePage =
      pageStore.persist.onFinishHydration(updateHydrationState);
    const unsubscribeInformation =
      informationStore.persist.onFinishHydration(updateHydrationState);

    return () => {
      unsubscribePage();
      unsubscribeInformation();
    };
  }, []);

  useEffect(() => {
    if (hasHydrated && !step) setPage(PERSONAL_INFORMATIONS_PAGE);
  }, [hasHydrated, setPage, step]);

  if (!hasHydrated || !step) return null;

  const Step = step.module.Page;
  return (
    <main className="flex min-h-full w-full flex-col items-center overflow-y-auto">
      <h1 className="w-full max-w-[32rem] px-8 pt-8 text-center text-lg font-bold">
        {step.title}
      </h1>
      <Step />
    </main>
  );
}
