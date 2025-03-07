"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useSettings } from "@/components/settings-provider";

export default function NotFound() {
  const { fontSize, accentColor } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = {
    error: searchParams.get("error")
  };

  // Custom error message based on query parameter
  let errorMessage = "An unknown error occurred.";
  if (query.error === "Configuration") {
    errorMessage = "There was a configuration error.";
  } else if (query.error === "AccessDenied") {
    errorMessage = "You do not have access to this resource.";
  } else if (query.error === "Unauthorized") {
    errorMessage = "You are not authorized to perform this action.";
  }

  return (
    <main className="min-h-screen bg-background p-6 mt-[5rem]" style={{ fontSize: `${fontSize / 16}rem` }}>
      <div className="max-w-2xl mx-auto space-y-8">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <Card className="p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold">Authentication Error</h1>
          <p className="text-lg text-muted-foreground">{errorMessage}</p>
          <Button asChild size="lg" variant="accent" className="w-full" style={{ backgroundColor: accentColor }}>
            <Link href="/">Go Back Home</Link>
          </Button>
        </Card>
      </div>
    </main>
  );
}