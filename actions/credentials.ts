"use server";

import { cookies } from "next/headers";

export async function getClientId() {
  return process.env.CLIENT_ID;
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("access_token");

  if (!cookie) return null;

  return cookie.value;
}

export async function setAccessToken(accessToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken);
}
