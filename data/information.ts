import {
  EducationT,
  ExperienceT,
  InformationsT,
  LanguageT,
  ProjectT,
  SetupT,
} from "@/types/information";

export const DEFAULT_INFORMATIONS: InformationsT = {
  firstName: "",
  lastName: "",
  role: "",
  birthDate: "",
  number: "",
  location: "",
  email: "",
  language: [
    {
      name: "",
      level: "",
    },
  ],
  experience: [],
  education: [],
  project: [],
  setup: [],
};

export function getLanguage(languages: LanguageT[]) {
  return `<div class="subsection">
        <span class="subsection-title">Language</span>
        <div class="infos">
          ${languages.reduce((HTML, currentLanguage) => {
            return HTML.concat(`
              <div class="info">
                <span class="info-title">${currentLanguage.name}</span>
                <span class="info-description">${currentLanguage.level}</span>
              </div>
            `);
          }, "")}
        </div>
      </div>`;
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
