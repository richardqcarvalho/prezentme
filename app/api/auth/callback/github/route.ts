import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
} from "@/lib/session";
import { upsertGitHubUser } from "@/lib/users";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/?error=oauth", url.origin));
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/auth/callback/github`,
    }),
  });

  const { access_token } = (await tokenResponse.json()) as {
    access_token?: string;
  };

  if (!access_token) {
    return NextResponse.redirect(new URL("/?error=token", url.origin));
  }

  const profileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const profile = (await profileResponse.json()) as {
    id: number;
    login: string;
    name: string | null;
    location: string | null;
  };

  const user = await upsertGitHubUser({
    githubId: String(profile.id),
    login: profile.login,
    name: profile.name,
    location: profile.location,
  });

  const response = NextResponse.redirect(new URL("/", url.origin));
  response.cookies.set(SESSION_COOKIE, createSessionToken(user.id), {
    ...(await getSessionCookieOptions()),
  });
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}
