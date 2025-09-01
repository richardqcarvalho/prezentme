export type LanguageT = {
  name: string;
  level: string;
};

type TechnologyT = {
  name: string;
};

export type ExperienceT = {
  title: string;
  start: string;
  end: string;
  description: string;
  technologies: TechnologyT[];
};

export type EducationT = {
  title: string;
  description: string;
};

export type ProjectT = {
  title: string;
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
