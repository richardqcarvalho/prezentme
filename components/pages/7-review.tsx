"use client";

import Button from "@/components/button";
import { DEFAULT_INFORMATIONS, generateHTML } from "@/data/information";
import { SETUP_PAGE } from "@/lib/constants";
import { informationStore, pageStore } from "@/store";

export function Page() {
  const informations = informationStore();
  const { setPage } = pageStore();

  function download() {
    const { setInformation: _setInformation, ...portfolio } = informations;
    const file = generateHTML(portfolio);
    const url = window.URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "index.html";
    link.click();
    window.URL.revokeObjectURL(url);
  }

  function startOver() {
    informations.setInformation(DEFAULT_INFORMATIONS);
    setPage(0);
  }

  return (
    <section className="flex w-full max-w-[32rem] flex-col gap-8 p-8">
      <div className="rounded-lg border border-black/20 p-8">
        <p className="text-sm font-bold tracking-wide text-black/60 uppercase">
          Review
        </p>
        <h1 className="mt-2 text-3xl font-black">Your portfolio is ready.</h1>
        <p className="mt-3 text-black/70">
          Download a standalone HTML file you can upload to any static web host.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setPage(SETUP_PAGE)} type="button">
          Back
        </Button>
        <Button onClick={download} type="button">
          Download HTML
        </Button>
        <Button onClick={startOver} type="button">
          Start over
        </Button>
      </div>
    </section>
  );
}

export const pageId = "review";
