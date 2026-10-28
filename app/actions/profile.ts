"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/session";

export type UpdateProfileState = {
  success: boolean;
  error?: string;
};

export async function updateProfile(formData: FormData): Promise<UpdateProfileState> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const firstName = (formData.get("firstName") as string)?.trim() || null;
  const lastName = (formData.get("lastName") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const role = (formData.get("role") as string)?.trim() || null;

  try {
    await db
      .update(users)
      .set({ firstName, lastName, location, role, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
