import {
  EducationT,
  ExperienceT,
  LanguageT,
  ProjectT,
  SetupT,
} from "@/types/information";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguage(languages: LanguageT[]) {
  return "";
}

export function getExperience(experiences: ExperienceT[]) {
  return "";
}

export function getEducation(educations: EducationT[]) {
  return "";
}

export function getProject(projects: ProjectT[]) {
  return "";
}

export function getSetup(setups: SetupT[]) {
  return "";
}
