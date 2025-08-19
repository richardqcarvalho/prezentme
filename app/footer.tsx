"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <div>
      <Button
        className="cursor-pointer"
        onClick={() => router.push("/informations")}
      >
        <span>Create your portfolio</span>
        <ArrowRight />
      </Button>
    </div>
  );
}
