"use server";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function getOrSetSessionId() {
  const cookieStore = await cookies(); // Await the cookies here
  const sessionIdCookie = cookieStore.get("sessionId");

  if (!sessionIdCookie) {
    const sessionId = uuidv4();

    const response = NextResponse.next();
    response.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response; // Return the NextResponse with the sessionId set in the cookie
  }

  return { sessionId: sessionIdCookie.value }; // If sessionId cookie exists, return its value
}
