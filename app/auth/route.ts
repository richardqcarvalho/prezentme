import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET)
    redirect("/login");

  const urlParams = new URLSearchParams({
    code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  }).toString();
  const response = await fetch(
    `https://github.com/login/oauth/access_token?${urlParams}`,
    {
      method: "POST",
    },
  );

  if (response.status !== 200) redirect("/login");

  const params = await response.text();
  const accessToken = new URLSearchParams(params).get("access_token");
  const cookieStore = await cookies();

  if (!accessToken) redirect("/login");

  cookieStore.set("access_token", accessToken);

  redirect("/");
}
