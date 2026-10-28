import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { education, experiences, languages, setups, users } from "@/lib/db/schema";

type GitHubProfile = {
  githubId: string;
  login: string | null;
  name: string | null;
  location: string | null;
};

export async function upsertGitHubUser(profile: GitHubProfile) {
  const [firstName, ...rest] = (profile.name ?? "").split(" ");

  const [user] = await db
    .insert(users)
    .values({
      githubId: profile.githubId,
      githubLogin: profile.login,
      firstName: firstName || null,
      lastName: rest.join(" ") || null,
      location: profile.location,
    })
    .onConflictDoUpdate({
      target: users.githubId,
      set: {
        githubLogin: profile.login,
        updatedAt: new Date(),
      },
    })
    .returning();

  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ?? null;
}

export async function getUserLanguages(userId: string) {
  return db.select().from(languages).where(eq(languages.userId, userId));
}

export async function getUserEducation(userId: string) {
  return db.select().from(education).where(eq(education.userId, userId));
}

export async function getUserExperiences(userId: string) {
  return db.select().from(experiences).where(eq(experiences.userId, userId));
}

export async function getLatestSetup(userId: string) {
  const [setup] = await db
    .select()
    .from(setups)
    .where(eq(setups.userId, userId))
    .orderBy(desc(setups.updatedAt))
    .limit(1);
  return setup ?? null;
}
