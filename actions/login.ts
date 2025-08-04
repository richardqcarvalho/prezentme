"use server";

export async function getClientId() {
  return process.env.CLIENT_ID;
}
