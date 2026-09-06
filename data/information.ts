import { HTML } from "@/data/template";
import {
  EducationT,
  ExperienceT,
  InformationsT,
  LanguageT,
  ProjectT,
  SetupT,
} from "@/types/information";

const escapeHTML = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character];
  });

const hasText = (value: string) => value.trim().length > 0;

const getSafeURL = (value: string) => {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? escapeHTML(url.href)
      : "#";
  } catch {
    return "#";
  }
};

const getEmailHref = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? `mailto:${encodeURIComponent(email.trim())}`
    : "#";

const normalizeWhatsAppNumber = (number: string) => {
  const digits = number.replace(/\D/g, "");
  return digits.startsWith("00") ? digits.slice(2) : digits;
};

type Month = { year: number; month: number };

const getMonth = (value: string): Month | null => {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value.trim());
  if (!match) return null;

  return { year: Number(match[1]), month: Number(match[2]) };
};

const getDurationMonths = (start: Month, end: Month) =>
  (end.year - start.year) * 12 + end.month - start.month;

const formatDuration = (months: number) => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const duration = [];

  if (years > 0) duration.push(`${years}y`);
  if (remainingMonths > 0) duration.push(`${remainingMonths}m`);

  return duration.join(", ");
};

const getCurrentMonth = (): Month => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const getDateRange = (start: string, end: string) => {
  const startMonth = getMonth(start);
  const endMonth = hasText(end) ? getMonth(end) : getCurrentMonth();
  if (!startMonth || !endMonth) return null;

  const durationMonths = getDurationMonths(startMonth, endMonth);
  if (durationMonths < 0) return null;

  return {
    durationMonths,
    label: `${startMonth.month}/${startMonth.year} to ${hasText(end) ? `${endMonth.month}/${endMonth.year}` : "Present"}`,
  };
};

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

export function generateHTML(informations: InformationsT) {
  const number = normalizeWhatsAppNumber(informations.number);
  const replacements: Record<string, string> = {
    firstName: escapeHTML(informations.firstName),
    lastName: escapeHTML(informations.lastName),
    role: escapeHTML(informations.role),
    gitHubHref: getSafeURL(informations.gitHub),
    linkedInHref: getSafeURL(informations.linkedIn),
    number: escapeHTML(number),
    numberHref: number ? `https://wa.me/${number}` : "#",
    location: escapeHTML(informations.location),
    email: escapeHTML(informations.email),
    emailHref: getEmailHref(informations.email),
    language: getLanguage(informations.language),
    experience: getExperience(informations.experience),
    education: getEducation(informations.education),
    project: getProject(informations.project),
    setup: getSetup(informations.setup),
  };

  const filledHTML = Object.entries(replacements).reduce(
    (html, [key, value]) => html.replaceAll(`{${key}}`, value),
    HTML,
  );

  return new Blob([filledHTML], { type: "text/html;charset=utf-8" });
}

export function getLanguage(languages: LanguageT[]) {
  const entries = languages.filter(
    (language) => hasText(language.name) && hasText(language.level),
  );
  if (entries.length === 0) return "";

  return `
    <div class="subsection">
      <span class="subsection-title">Language</span>
      <div class="infos">
        ${entries
          .map(
            (language) => `
              <div class="info">
                <span class="info-title">${escapeHTML(language.name)}</span>
                <span class="info-description">${escapeHTML(language.level)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

export function getExperience(experiences: ExperienceT[]) {
  const entries = experiences.flatMap((experience) => {
    const dateRange = getDateRange(experience.start, experience.end);
    if (
      !dateRange ||
      !hasText(experience.title) ||
      !hasText(experience.company) ||
      !hasText(experience.description)
    ) {
      return [];
    }

    const technologies = experience.technologies.filter(hasText);
    return [{ experience, dateRange, technologies }];
  });
  if (entries.length === 0) return "";

  const totalDuration = formatDuration(
    entries.reduce((total, entry) => total + entry.dateRange.durationMonths, 0),
  );

  return `
    <div class="subsection">
      <span class="subsection-title">Experience${totalDuration ? ` (${totalDuration})` : ""}</span>
      <div class="infos">
        ${entries
          .map(
            ({ experience, dateRange, technologies }) => `
              <div class="info">
                <span class="info-title">${escapeHTML(experience.title)}</span>
                <span class="info-subtitle">${escapeHTML(experience.company)}</span>
                <span class="info-subtitle">${dateRange.label}${dateRange.durationMonths ? ` (${formatDuration(dateRange.durationMonths)})` : ""}</span>
                <span class="info-description">${escapeHTML(experience.description)}</span>
                ${
                  technologies.length > 0
                    ? `<div class="technologies">${technologies.map((technology) => `<span class="technology">${escapeHTML(technology)}</span>`).join("")}</div>`
                    : ""
                }
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

export function getEducation(educations: EducationT[]) {
  const entries = educations.flatMap((education) => {
    const dateRange = getDateRange(education.start, education.end);
    return dateRange &&
      hasText(education.title) &&
      hasText(education.university)
      ? [{ education, dateRange }]
      : [];
  });
  if (entries.length === 0) return "";

  return `
    <div class="subsection">
      <span class="subsection-title">Education</span>
      <div class="infos">
        ${entries
          .map(
            ({ education, dateRange }) => `
              <div class="info">
                <span class="info-title">${escapeHTML(education.title)}</span>
                <span class="info-subtitle">${escapeHTML(education.university)}</span>
                <span class="info-subtitle">${dateRange.label}${dateRange.durationMonths ? ` (${formatDuration(dateRange.durationMonths)})` : ""}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

export function getProject(projects: ProjectT[]) {
  const entries = projects.filter(
    (project) => hasText(project.title) && hasText(project.description),
  );
  if (entries.length === 0) return "";

  return `
    <div class="subsection">
      <span class="subsection-title">Projects</span>
      <div class="infos">
        ${entries
          .map((project) => {
            const technologies = project.technologies.filter(hasText);
            const title = escapeHTML(project.title);
            const safeURL = getSafeURL(project.url);
            return `
              <div class="info">
                ${hasText(project.url) && safeURL !== "#" ? `<a class="info-title" href="${safeURL}" target="_blank" rel="noopener noreferrer">${title}</a>` : `<span class="info-title">${title}</span>`}
                <span class="info-description">${escapeHTML(project.description)}</span>
                ${technologies.length > 0 ? `<div class="technologies">${technologies.map((technology) => `<span class="technology">${escapeHTML(technology)}</span>`).join("")}</div>` : ""}
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

export function getSetup(setups: SetupT[]) {
  const entries = setups.filter(
    (setup) => hasText(setup.name) && hasText(setup.specs),
  );
  if (entries.length === 0) return "";

  return `
    <div class="subsection">
      <span class="subsection-title">Setup</span>
      <div class="infos">
        ${entries
          .map(
            (setup) => `
              <div class="info">
                <span class="info-title">${escapeHTML(setup.name)}</span>
                <span class="info-description">${escapeHTML(setup.specs)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}
