import { readFile } from "node:fs/promises";

async function GET() {
  const file = await readFile("index.html");
  const headers = new Headers();

  headers.append("Content-Disposition", 'attachment; filename="index.html"');

  return new Response(file as BodyInit, {
    headers,
  });
}

export { GET };
