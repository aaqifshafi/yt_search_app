"use server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function getOrSetSessionId() {
  console.log("fetching sessionId in cookie file");
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get("sessionId");

  if (!sessionIdCookie) {
    const sessionId = uuidv4();

    await cookieStore.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { sessionId };
  }

  return { sessionId: sessionIdCookie.value };
}
