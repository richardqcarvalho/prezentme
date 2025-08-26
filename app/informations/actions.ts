"use server";

import { DEFAULT_INFORMATIONS } from "@/app/informations/data";
import { writeFile } from "fs/promises";

export async function generateHTML(informations: typeof DEFAULT_INFORMATIONS) {
  const HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        width: 100svw;
        height: 100svh;
        margin: 0;
      }

      main {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <main>
      <span>${informations.firstName} ${informations.lastName}</span>
      <span>${informations.number}</span>
      <span>${informations.location}</span>
      <span>${informations.email}</span>
    </main>
  </body>
</html>`;

  await writeFile("index.html", HTML);
}
