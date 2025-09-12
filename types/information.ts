export type LanguageT = {
  name: string;
  level: string;
};

export type ExperienceT = {
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
  technologies: string[];
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
  technologies: string[];
};

export type SetupT = {
  name: string;
  specs: string;
};

export type InformationsT = {
  firstName: string;
  lastName: string;
  role: string;
  gitHub: string;
  linkedIn: string;
  number: string;
  location: string;
  email: string;
  language: LanguageT[];
  experience: ExperienceT[];
  education: EducationT[];
  project: ProjectT[];
  setup: SetupT[];
};

export type InformationStoreT = InformationsT & {
  setInformation: (informations: Partial<InformationsT>) => void;
};
