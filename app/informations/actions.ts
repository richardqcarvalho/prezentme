import DEFAULT_INFORMATIONS from "@/data/information";
import { HTML } from "@/data/template";
import {
  getEducation,
  getExperience,
  getLanguage,
  getProject,
  getSetup,
} from "@/lib/utils";

export async function generateHTML(informations: typeof DEFAULT_INFORMATIONS) {
  const birthDate = new Date(`${informations.birthDate}T00:00:00`);
  const birthDateString = birthDate.toLocaleDateString();
  const age = Math.floor((Date.now() - birthDate.getTime()) / 31540000000);
  const filledHTML = HTML.replaceAll("{firstName}", informations.firstName)
    .replaceAll("{lastName}", informations.lastName)
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
