import { HTML } from "@/data/template";
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
  const birthDate = new Date(`${informations.birthDate}T00:00:00`);
  const birthDateString = birthDate.toLocaleDateString();
  const age = Math.floor((Date.now() - birthDate.getTime()) / 31540000000);
  const filledHTML = HTML.replaceAll("{firstName}", informations.firstName)
    .replaceAll("{lastName}", informations.lastName)
    .replaceAll("{role}", informations.role)
    .replaceAll("{birthDate}", `${birthDateString} (${age} years old)`)
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
    const years = Math.floor(difference / 31536000000);
    const months = Math.floor((difference % 31536000000) / 2628002880);
    const tuple = [];
    if (years > 0) tuple.push(`${years}y`);
    if (months > 0) tuple.push(`${months}m`);

    HTML += `
      <div class="info">
        <span class="info-title">${experience.title}</span>
        <span class="info-subtitle">${experience.company}</span>
        <span class="info-subtitle">${startMonth}/${startYear} to ${endMonth}/${endYear} (${tuple.join(", ")})</span>
        <span class="info-description">${experience.description}</span>
        <div class="technologies">
          ${experience.technologies.reduce(
            (HTML, technology) =>
              HTML.concat(`<span class="technology">${technology}</span>`),
            "",
          )}
        </div>
      </div>
    `;
  }

  const years = Math.floor(totalExperience / 31536000000);
  const months = Math.floor((totalExperience % 31536000000) / 2628002880);
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
