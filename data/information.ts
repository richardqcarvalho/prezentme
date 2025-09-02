import {
  EducationT,
  ExperienceT,
  InformationsT,
  LanguageT,
  ProjectT,
  SetupT,
} from "@/model/information";

export const DEFAULT_INFORMATIONS: InformationsT = {
  firstName: "",
  lastName: "",
  role: "",
  birthDate: "",
  number: "",
  location: "",
  email: "",
  language: [],
  experience: [],
  education: [],
  project: [],
  setup: [],
};

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
