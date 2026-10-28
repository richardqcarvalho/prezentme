import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

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
