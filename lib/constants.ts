export const FLUENCY_LEVELS = ["native", "fluent", "advanced", "intermediate", "basic"] as const;

export type FluencyLevel = (typeof FLUENCY_LEVELS)[number];

export const EDUCATION_LEVELS = [
  "high_school",
  "bootcamp",
  "associate",
  "bachelor",
  "master",
  "phd",
  "other",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export function isFluencyLevel(value: unknown): value is FluencyLevel {
  return FLUENCY_LEVELS.includes(value as FluencyLevel);
}

export function isEducationLevel(value: unknown): value is EducationLevel {
  return EDUCATION_LEVELS.includes(value as EducationLevel);
}
