"use client";

import { getClientId } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default function Login() {
  const { data: clientId, isPending } = useQuery({
    queryKey: ["login"],
    queryFn: getClientId,
  });

  if (isPending || !clientId) return <div />;

  const urlParams = new URLSearchParams({
    client_id: clientId,
    scope: "user",
  }).toString();

  function handleClick() {
    redirect(`https://github.com/login/oauth/authorize?${urlParams}`);
  }

  return (
    <div>
      <Button onClick={handleClick}>Login with GitHub</Button>
    </div>
  );
}
