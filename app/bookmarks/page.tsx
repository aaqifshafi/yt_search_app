"use client";
import { useEffect, useState } from "react";
import { BookmarkCard } from "@/components/BookmrkCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkVideo } from "@/types";
import { getOrSetSessionId } from "@/lib/cookies";
import { BookmarkIcon, RefreshCwIcon, AlertTriangleIcon } from "lucide-react";

// Define an interface for the API response
interface BookmarkApiResponse {
  message?: string;
  bookmarks?: BookmarkVideo[];
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [bookmarkedVideos, setBookmarkedVideos] = useState<Set<string>>(
    new Set()
  );

  // Fetch bookmarks from the API
  const fetchBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionIdResponse = await getOrSetSessionId();
      let sessionId = "";
      if (sessionIdResponse instanceof Response) {
        const sessionCookie = sessionIdResponse.cookies.get("sessionId");
        sessionId = sessionCookie ? sessionCookie.value : "";
      } else {
        sessionId = sessionIdResponse.sessionId || "";
      }

      const response = await fetch(`/api/mybookmarks?sessionId=${sessionId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      const data: BookmarkApiResponse = await response.json();
      let formattedBookmarks: BookmarkVideo[] = [];

      if (data.message) {
        console.log(data.message);
        formattedBookmarks = [];
      } else if (Array.isArray(data)) {
        formattedBookmarks = (data as BookmarkVideo[]).map((item) => ({
          ...item,
          id: item.videoId,
        }));
      } else if (Array.isArray(data.bookmarks)) {
        formattedBookmarks = data.bookmarks.map((item: BookmarkVideo) => ({
          ...item,
          id: item.videoId,
        }));
      }

      formattedBookmarks.reverse();
      setBookmarks(formattedBookmarks);
      setTotalPages(Math.ceil(formattedBookmarks.length / 5));

      // Update the bookmarkedVideos set
      const bookmarkedVideoIds: Set<string> = new Set(
        formattedBookmarks.map((video) => video.id)
      );
      setBookmarkedVideos(bookmarkedVideoIds);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      setError("Unable to load bookmarks. Please try again.");
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookmarks when the component mounts
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Paginate the bookmarks for display
  const paginatedBookmarks = bookmarks.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle bookmark add/remove
  const handleBookmark = async (
    video: BookmarkVideo,
    isBookmarked: boolean
  ) => {
    try {
      const sessionIdResponse = await getOrSetSessionId();
      let sessionId = "";
      if (sessionIdResponse instanceof Response) {
        const sessionCookie = sessionIdResponse.cookies.get("sessionId");
        sessionId = sessionCookie ? sessionCookie.value : "";
      } else {
        sessionId = sessionIdResponse.sessionId || "";
      }

      let response;
      if (isBookmarked) {
        // If the video is bookmarked, remove it
        response = await fetch(`/api/bookmark?sessionId=${sessionId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId: video.id }),
        });
        if (response.ok) {
          setBookmarkedVideos((prevSet) => {
            const newSet = new Set(prevSet);
            newSet.delete(video.id);
            return newSet;
          });
          // Re-fetch the bookmarks to ensure the list is updated
          fetchBookmarks();
        }
      } else {
        // If the video is not bookmarked, add it
        response = await fetch(`/api/add-bookmark?sessionId=${sessionId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId: video.id }),
        });
        if (response.ok) {
          setBookmarkedVideos((prevSet) => new Set(prevSet).add(video.id));
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
    </div>
  );

  // Render error state
  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
      <AlertTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-muted-foreground mb-2">
        Oops! Something Went Wrong
      </h2>
      <p className="text-gray-500 mb-4">{error}</p>
      <button
        onClick={fetchBookmarks}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
      >
        <RefreshCwIcon className="mr-2 w-4 h-4" />
        Try Again
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-center mb-8">
        <BookmarkIcon className="w-10 h-10 mr-3 text-blue-600" />
        <h1 className="text-4xl font-bold text-bg-foreground">My Bookmarks</h1>
      </div>

      {/* Content */}
      {loading ? (
        renderLoadingSkeleton()
      ) : error ? (
        renderErrorState()
      ) : (
        <>
          {/* Bookmarks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedBookmarks.length > 0 ? (
              paginatedBookmarks.map((video) => (
                <BookmarkCard
                  key={video.id}
                  data={video}
                  isBookmarked={bookmarkedVideos.has(video.id)}
                  handleBookmark={handleBookmark}
                />
              ))
            ) : (
              <div className="col-span-4 text-center py-12 bg-border rounded-lg">
                <BookmarkIcon className="w-16 h-16 mx-auto mb-4 text-foreground" />
                <p className="text-xl text-muted-foreground">
                  No bookmarks found. Start exploring and save some videos!
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent className="flex items-center space-x-2">
                  {/* Previous Page */}
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="hover:bg-gray-100 transition"
                      />
                    </PaginationItem>
                  )}

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === index + 1
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Next Page */}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="hover:bg-gray-100 transition"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
