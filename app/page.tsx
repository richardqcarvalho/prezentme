"use client";

import { getAccessToken } from "@/actions/credentials";
import CompleteInput from "@/components/complete-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { pages } from "@/data/pages";
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

  return (
    <div>
      <Card>
        <CardContent className="flex flex-col gap-3">
          {pages[page].map(({ id, label, placeholder }) => (
            <CompleteInput
              key={id}
              id={id}
              label={label}
              placeholder={placeholder}
              onChange={(e) => inputs.setInputValue(id, e.target.value)}
              value={(inputs[id] as string) || ""}
            />
          ))}
        </CardContent>
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
