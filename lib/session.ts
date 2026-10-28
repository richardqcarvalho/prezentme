import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies, headers } from "next/headers";

import { getUserById } from "@/lib/users";
import type { User } from "@/lib/db/schema";

export const SESSION_COOKIE = "session";
export const OAUTH_STATE_COOKIE = "github_oauth_state";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const OAUTH_STATE_MAX_AGE = 600; // 10 minutes

function sign(value: string) {
  return createHmac("sha256", process.env.SESSION_SECRET!).update(value).digest("base64url");
}

export function createSessionToken(userId: string) {
  return `${userId}.${sign(userId)}`;
}

function verifySessionToken(token: string): string | null {
  const userId = token.slice(0, token.lastIndexOf("."));
  const signature = token.slice(token.lastIndexOf(".") + 1);
  const expected = sign(userId);
  const valid =
    signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  return valid ? userId : null;
}

export async function getSessionUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const userId = verifySessionToken(token);
  if (!userId) return null;

  return getUserById(userId);
}

export async function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  } as const;
}

export async function getOAuthStateCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: OAUTH_STATE_MAX_AGE,
  } as const;
}

export async function getOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
