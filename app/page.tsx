"use client";

import PageOne from "@/components/pages/one";
import PageThree from "@/components/pages/three";
import PageTwo from "@/components/pages/two";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { inputStore, pageStore } from "@/store";
import { inputStoreT } from "@/types";
import { JSX } from "react";

type ElementT = JSX.Element & inputStoreT;

export default function Home() {
  const { page, setPage } = pageStore();
  const inputs = inputStore();
  const pages = [PageOne, PageTwo, PageThree].map((Element) => (
    <Element store={inputs} />
  ));

  return (
    <div>
      <Card>
        <CardContent className="flex flex-col gap-6">{pages[page]}</CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="cursor-pointer"
            onClick={() => setPage(page - 1)}
            disabled={page - 1 < 0}
          >
            Back
          </Button>
          <Button
            className="cursor-pointer"
            onClick={() => {
              setPage(page + 1);
            }}
            disabled={page === pages.length - 1}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
