"use server";
import { NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { BookmarkVideo } from "@/types";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const bookmarksRef = ref(db, `users/${sessionId}/bookmarks`);

    const snapshot = await get(bookmarksRef);
    if (!snapshot.exists()) {
      return NextResponse.json({
        message: "No bookmarks found for this session",
      });
    }

    const bookmarks = snapshot.val();

    const typedBookmarks = bookmarks as { [key: string]: BookmarkVideo };

    const formattedBookmarks = Object.values(typedBookmarks).map(
      (bookmark) => ({
        ...bookmark,
        id: bookmark.videoId,
      })
    );

    return NextResponse.json(formattedBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}
