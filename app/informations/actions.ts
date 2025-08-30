"use server";

import { DEFAULT_INFORMATIONS } from "@/app/informations/data";
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function generateHTML(informations: typeof DEFAULT_INFORMATIONS) {
  const HTML = await readFile(
    path.resolve(process.cwd(), "app", "informations", "template.html"),
  );
  const filledHTML = HTML.toString()
    .replaceAll("${informations.firstName}", informations.firstName)
    .replaceAll("${informations.lastName}", informations.lastName)
    .replaceAll("${informations.number}", informations.number)
    .replaceAll("${informations.location}", informations.location)
    .replaceAll("${informations.email}", informations.email);

  return new Blob([filledHTML]);
}
