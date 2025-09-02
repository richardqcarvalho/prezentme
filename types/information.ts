import { DEFAULT_INFORMATIONS } from "@/data/information";

export type LanguageT = {
  name: string;
  level: string;
};

type TechnologyT = {
  name: string;
};

export type ExperienceT = {
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
  technologies: TechnologyT[];
};

export type EducationT = {
  title: string;
  university: string;
  start: string;
  end: string;
};

export type ProjectT = {
  title: string;
  url: string;
  description: string;
  technologies: TechnologyT[];
};

export type SetupT = {
  name: string;
  specs: string;
};

export type InformationsT = {
  firstName: string;
  lastName: string;
  role: string;
  birthDate: string;
  number: string;
  location: string;
  email: string;
  language: LanguageT[];
  experience: ExperienceT[];
  education: EducationT[];
  project: ProjectT[];
  setup: SetupT[];
};

export type InformationsStoreT = typeof DEFAULT_INFORMATIONS & {
  setInformation: (informations: Partial<typeof DEFAULT_INFORMATIONS>) => void;
};
