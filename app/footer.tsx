"use client";

import Button from "@/components/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.push("/about-me")}>
        <span>Create your portfolio</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
