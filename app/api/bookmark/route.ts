"use server";
import { NextResponse } from "next/server";
import { ref, push, get, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import { getOrSetSessionId } from "@/lib/cookies";
import { BookmarkVideo } from "@/types";

export async function POST(req: Request) {
  try {
    const sessionIdResponse = await getOrSetSessionId();
    const sessionId =
      sessionIdResponse instanceof NextResponse
        ? sessionIdResponse.cookies.get("sessionId")
        : sessionIdResponse.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is missing" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      videoId,
      title,
      channelTitle,
      thumbnailUrl,
      viewCount,
      duration,
      channelThumbnail,
      publishedAt,
      channelId,
    } = body;

    const userBookmarksRef = ref(db, `users/${sessionId}/bookmarks`);

    const snapshot = await get(userBookmarksRef);
    const existingBookmarks = snapshot.val();

    if (existingBookmarks) {
      // Type the existingBookmarks as a dictionary where keys are strings and values are BookmarkVideo
      const isVideoAlreadyBookmarked = Object.values(
        existingBookmarks as { [key: string]: BookmarkVideo }
      ).some((bookmark) => bookmark.videoId === videoId);

      if (isVideoAlreadyBookmarked) {
        return NextResponse.json(
          { error: "This video is already bookmarked" },
          { status: 400 }
        );
      }
    }

    await push(userBookmarksRef, {
      videoId,
      title,
      channelTitle,
      thumbnailUrl,
      viewCount,
      duration,
      channelThumbnail,
      publishedAt,
      channelId,
    });

    return NextResponse.json({ message: "Video bookmarked successfully!" });
  } catch (error) {
    console.error("Error saving bookmark:", error);
    return NextResponse.json(
      { error: "Failed to bookmark the video" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const sessionIdResponse = await getOrSetSessionId();
    const sessionId =
      sessionIdResponse instanceof NextResponse
        ? sessionIdResponse.cookies.get("sessionId")
        : sessionIdResponse.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is missing" },
        { status: 400 }
      );
    }

    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required to remove bookmark" },
        { status: 400 }
      );
    }

    const userBookmarksRef = ref(db, `users/${sessionId}/bookmarks`);

    const snapshot = await get(userBookmarksRef);
    const existingBookmarks = snapshot.val();

    if (!existingBookmarks) {
      return NextResponse.json(
        { error: "No bookmarks found for this session" },
        { status: 404 }
      );
    }

    const bookmarkToRemove = Object.entries(
      existingBookmarks as { [key: string]: BookmarkVideo }
    ).find(([, bookmark]) => bookmark.videoId === videoId);

    if (!bookmarkToRemove) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    const [bookmarkKey] = bookmarkToRemove;
    const bookmarkRef = ref(db, `users/${sessionId}/bookmarks/${bookmarkKey}`);
    await remove(bookmarkRef);

    return NextResponse.json({ message: "Bookmark removed successfully!" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: "Failed to remove the bookmark" },
      { status: 500 }
    );
  }
}
