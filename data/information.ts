import { HTML } from "@/data/template";
import { MILLISECONDS_TO_MONTH, MILLISECONDS_TO_YEAR } from "@/lib/constants";
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
  number: "",
  gitHub: "",
  linkedIn: "",
  location: "",
  email: "",
  language: [
    {
      name: "",
      level: "",
    },
  ],
  experience: [
    {
      title: "",
      company: "",
      start: "",
      end: "",
      description: "",
      technologies: [],
    },
  ],
  education: [
    {
      title: "",
      university: "",
      start: "",
      end: "",
    },
  ],
  project: [
    {
      title: "",
      url: "",
      description: "",
      technologies: [],
    },
  ],
  setup: [
    {
      name: "",
      specs: "",
    },
  ],
};

export async function generateHTML(informations: InformationsT) {
  const filledHTML = HTML.replaceAll("{firstName}", informations.firstName)
    .replaceAll("{lastName}", informations.lastName)
    .replaceAll("{role}", informations.role)
    .replaceAll("{gitHub}", informations.gitHub)
    .replaceAll("{linkedIn}", informations.linkedIn)
    .replaceAll("{number}", informations.number)
    .replaceAll("{location}", informations.location)
    .replaceAll("{email}", informations.email)
    .replaceAll("{language}", getLanguage(informations.language))
    .replaceAll("{experience}", getExperience(informations.experience))
    .replaceAll("{education}", getEducation(informations.education))
    .replaceAll("{project}", getProject(informations.project))
    .replaceAll("{setup}", getSetup(informations.setup));

  return new Blob([filledHTML]);
}

export function getLanguage(languages: LanguageT[]) {
  return `
    <div class="subsection">
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
    </div>
  `;
}

export function getExperience(experiences: ExperienceT[]) {
  let totalExperience = 0;
  let HTML = "";

  for (const experience of experiences) {
    const startDate = new Date(`${experience.start}-01T00:00:00`);
    const endDate = new Date(`${experience.end}-01T00:00:00`);
    const [startYear, startMonth] = experience.start.split("-");
    const [endYear, endMonth] = experience.end.split("-");
    const difference = endDate.getTime() - startDate.getTime();
    totalExperience += difference;
    const years = Math.floor(difference / MILLISECONDS_TO_YEAR);
    const months = Math.floor(
      (difference % MILLISECONDS_TO_YEAR) / MILLISECONDS_TO_MONTH,
    );
    const tuple = [];
    if (years > 0) tuple.push(`${years}y`);
    if (months > 0) tuple.push(`${months}m`);

    HTML += `
      <div class="info">
        <span class="info-title">${experience.title}</span>
        <span class="info-subtitle">${experience.company}</span>
        <span class="info-subtitle">${startMonth}/${startYear} to ${endMonth}/${endYear} (${tuple.join(", ")})</span>
        <span class="info-description">${experience.description}</span>
        ${
          experience.technologies.length > 0
            ? `<div class="technologies">
                ${experience.technologies.reduce(
                  (HTML, technology) =>
                    HTML.concat(
                      `<span class="technology">${technology}</span>`,
                    ),
                  "",
                )}
              </div>`
            : ""
        }
      </div>
    `;
  }

  const years = Math.floor(totalExperience / MILLISECONDS_TO_YEAR);
  const months = Math.floor(
    (totalExperience % MILLISECONDS_TO_YEAR) / MILLISECONDS_TO_MONTH,
  );
  const tuple = [];
  if (years > 0) tuple.push(`${years}y`);
  if (months > 0) tuple.push(`${months}m`);

  return `
    <div class="subsection">
      <span class="subsection-title">Experience (${tuple.join(", ")})</span>
      <div class="infos">
        ${HTML}
      </div>
    </div>
  `;
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
