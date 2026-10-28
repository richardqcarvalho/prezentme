"use server";

import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
  getOAuthStateCookieOptions,
  getOrigin,
} from "@/lib/session";

export async function signInWithGitHub() {
  const state = randomBytes(16).toString("hex");

  (await cookies()).set(OAUTH_STATE_COOKIE, state, await getOAuthStateCookieOptions());

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${await getOrigin()}/api/auth/callback/github`,
    state,
    scope: "read:user",
  });

  redirect(`https://github.com/login/oauth/authorize?${params}`);
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
