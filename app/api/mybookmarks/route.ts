"use server";
import { NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { BookmarkVideo } from "@/types"; // Assuming the BookmarkVideo type is defined

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

    // Reference to the bookmarks node for the specific sessionId
    const bookmarksRef = ref(db, `users/${sessionId}/bookmarks`);

    // Step 3: Get the snapshot of the bookmarks data for this sessionId
    const snapshot = await get(bookmarksRef);

    if (!snapshot.exists()) {
      return NextResponse.json({
        message: "No bookmarks found for this session",
      });
    }

    // Step 4: Convert snapshot data into an array (since Firebase returns it as an object)
    const bookmarks = snapshot.val();

    // Type the bookmarks object as a dictionary with string keys and BookmarkVideo values
    const typedBookmarks = bookmarks as { [key: string]: BookmarkVideo };

    // Convert the object to an array of bookmark values and map over it
    const formattedBookmarks = Object.values(typedBookmarks).map(
      (bookmark) => ({
        ...bookmark,
        id: bookmark.videoId, // Use the videoId as the key or another unique identifier
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
