import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguage(languages: any[]) {
  return "";
}

export function getExperience(experiences: any[]) {
  return "";
}

export function getEducation(educations: any[]) {
  return "";
}

export function getProject(projects: any[]) {
  return "";
}

export function getSetup(setups: any[]) {
  return "";
}
