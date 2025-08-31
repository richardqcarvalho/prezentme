import DEFAULT_INFORMATIONS from "@/data/informations";
import { HTML } from "@/data/template";

export async function generateHTML(informations: typeof DEFAULT_INFORMATIONS) {
  const filledHTML = HTML.replaceAll("{firstName}", informations.firstName)
    .replaceAll("{lastName}", informations.lastName)
    .replaceAll("{number}", informations.number)
    .replaceAll("{location}", informations.location)
    .replaceAll("{email}", informations.email);

  return new Blob([filledHTML]);
}
