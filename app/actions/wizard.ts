"use server";

import { revalidatePath } from "next/cache";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { education, experiences, languages, setups } from "@/lib/db/schema";
import { isEducationLevel, isFluencyLevel } from "@/lib/constants";
import { getSessionUser } from "@/lib/session";

export type ActionState = {
  success: boolean;
  error?: string;
};

function revalidate() {
  revalidatePath("/");
}

async function requireUserId() {
  const user = await getSessionUser();
  return user?.id ?? null;
}

function parseMonth(value: FormDataEntryValue | null) {
  const raw = (value as string)?.trim() || "";
  return /^\d{4}-\d{2}$/.test(raw) ? raw : null;
}

export async function saveLanguages(formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const names = formData.getAll("language").map((v) => String(v).trim());
  const fluencies = formData.getAll("fluency").map((v) => String(v).trim());

  const rows = names
    .map((language, i) => ({ language, fluency: fluencies[i] }))
    .filter((row) => row.language !== "");

  if (rows.length > 0) {
    const invalid = rows.find((row) => !isFluencyLevel(row.fluency));
    if (invalid) {
      return { success: false, error: "Please select a fluency level for each language." };
    }
  }

  try {
    await db.batch([
      db.delete(languages).where(eq(languages.userId, userId)),
      ...(rows.length > 0
        ? [
            db.insert(languages).values(
              rows.map((row) => ({
                userId,
                language: row.language,
                fluency: row.fluency,
                updatedAt: new Date(),
              })),
            ),
          ]
        : []),
    ]);
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to save languages:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function saveEducation(formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const degrees = formData.getAll("degree").map((v) => String(v).trim());
  const levels = formData.getAll("level").map((v) => String(v).trim());
  const universities = formData.getAll("university").map((v) => String(v).trim());
  const starts = formData.getAll("startDate").map((v) => String(v).trim());
  const ends = formData.getAll("endDate").map((v) => String(v).trim());

  const rows = degrees
    .map((degree, i) => ({
      degree,
      level: levels[i],
      university: universities[i],
      startDate: parseMonth(starts[i]),
      endDate: parseMonth(ends[i]),
    }))
    .filter((row) => row.degree !== "" && row.university !== "");

  if (rows.length > 0) {
    const invalid = rows.find((row) => !isEducationLevel(row.level) || row.university === "");
    if (invalid) {
      return {
        success: false,
        error: "Please select an education level and fill in the university for each entry.",
      };
    }
  }

  try {
    await db.batch([
      db.delete(education).where(eq(education.userId, userId)),
      ...(rows.length > 0
        ? [
            db
              .insert(education)
              .values(rows.map((row) => ({ userId, ...row, updatedAt: new Date() }))),
          ]
        : []),
    ]);
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to save education:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function saveExperiences(formData: FormData): Promise<ActionState> {
  const userId = await requireUserId();
  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  const companies = formData.getAll("company").map((v) => String(v).trim());
  const roles = formData.getAll("role").map((v) => String(v).trim());
  const descriptions = formData.getAll("description").map((v) => String(v).trim());
  const starts = formData.getAll("startDate").map((v) => String(v).trim());
  const ends = formData.getAll("endDate").map((v) => String(v).trim());
  const technologies = formData.getAll("technologies").map((v) => String(v).trim());

  const rows = companies
    .map((company, i) => ({
      company,
      role: roles[i],
      description: descriptions[i] || null,
      startDate: parseMonth(starts[i]),
      endDate: parseMonth(ends[i]),
      technologies: technologies[i]
        ? technologies[i]
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    }))
    .filter((row) => row.company !== "" || row.role !== "");

  const invalid = rows.find((row) => row.company === "" || row.role === "");
  if (invalid) {
    return {
      success: false,
      error: "Please fill in the role and company for each experience entry.",
    };
  }

  try {
    await db.batch([
      db.delete(experiences).where(eq(experiences.userId, userId)),
      ...(rows.length > 0
        ? [
            db
              .insert(experiences)
              .values(rows.map((row) => ({ userId, ...row, updatedAt: new Date() }))),
          ]
        : []),
    ]);
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to save experiences:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function saveSetup(formData: FormData): Promise<ActionState> {
  const user = await getSessionUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const name = (formData.get("name") as string)?.trim() || "";
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) {
    return { success: false, error: "Please give your setup a name." };
  }

  try {
    await db.insert(setups).values({
      userId: user.id,
      name,
      description,
      completedAt: new Date(),
    });
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Failed to save setup:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
