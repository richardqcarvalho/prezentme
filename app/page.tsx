import { LogOutIcon } from "lucide-react";

import { getSessionUser } from "@/lib/session";
import {
  getLatestSetup,
  getUserById,
  getUserEducation,
  getUserExperiences,
  getUserLanguages,
} from "@/lib/users";
import { signInWithGitHub, signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { OnboardingWizard } from "@/components/onboarding-wizard";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

export default async function Home() {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">prezentme</CardTitle>
            <CardDescription>Sign in to set up your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={signInWithGitHub}>
              <Button type="submit" className="w-full">
                <GitHubIcon data-icon="inline-start" />
                Sign in with GitHub
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  const [user, languages, education, experiences, setup] = await Promise.all([
    getUserById(sessionUser.id),
    getUserLanguages(sessionUser.id),
    getUserEducation(sessionUser.id),
    getUserExperiences(sessionUser.id),
    getLatestSetup(sessionUser.id),
  ]);

  if (!user) {
    return null;
  }

  const latest = (rows: { updatedAt: Date }[]) =>
    rows.reduce((max, row) => Math.max(max, row.updatedAt.getTime()), 0);

  const serverTimestamps = {
    profile: user.updatedAt.getTime(),
    languages: latest(languages),
    education: latest(education),
    experiences: latest(experiences),
    setup: setup?.updatedAt.getTime() ?? 0,
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <p className="text-sm text-muted-foreground">Signed in as @{user.githubLogin}</p>
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOutIcon data-icon="inline-start" />
            Sign out
          </Button>
        </form>
      </div>
      <OnboardingWizard
        user={user}
        languages={languages}
        education={education}
        experiences={experiences}
        setup={setup}
        serverTimestamps={serverTimestamps}
      />
    </main>
  );
}
