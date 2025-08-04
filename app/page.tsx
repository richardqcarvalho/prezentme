"use client";

import { getAccessToken } from "@/actions/credentials";
import PageOne from "@/components/pages/one";
import PageThree from "@/components/pages/three";
import PageTwo from "@/components/pages/two";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { inputStore, pageStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function Home() {
  const { page, setPage } = pageStore();
  const inputs = inputStore();
  const { data: accessToken, isPending } = useQuery({
    queryKey: ["access-token"],
    queryFn: getAccessToken,
  });

  if (isPending) return <div />;

  if (!accessToken) redirect("/login");

  const pages = [PageOne, PageTwo, PageThree].map((Element) => (
    <Element key={Element.toString()} store={inputs} />
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
