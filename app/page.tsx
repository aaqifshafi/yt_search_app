"use client";
import React, { useState, useEffect } from "react";
import { VideoCard } from "@/components/VideoCard";
import { SearchBar } from "@/components/SearchBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Video } from "@/types";
import { Loader2Icon, SearchIcon } from "lucide-react";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    setError(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const token =
      newPage === 1
        ? null
        : newPage > currentPage
        ? nextPageToken
        : prevPageToken;
    if (token) {
      fetchVideosData(searchTerm, token);
    } else {
      fetchVideosData(searchTerm);
    }
  };

  const fetchVideosData = async (
    query: string,
    pageToken: string | null = null
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/video/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchTerm: query,
          pageToken: pageToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();

      if (data.videos.length === 0) {
        setError("No videos found. Try a different search term.");
      }

      setVideos(data.videos);
      setNextPageToken(data.nextPageToken || null);
      setPrevPageToken(data.prevPageToken || null);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError("Unable to fetch videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkVideo = async (video: Video) => {
    try {
      const response = await fetch("/api/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: video.id.videoId,
          title: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          thumbnailUrl: video.snippet.thumbnails.high.url,
          viewCount: video.statistics.viewCount,
          publishedAt: video.snippet.publishedAt,
          duration: video.contentDetails.duration,
          channelThumbnail: video.channel.thumbnails.default.url,
          channelId: video.snippet.channelId,
        }),
      });

      if (!response.ok) {
        throw new Error("Bookmark failed");
      }

      const result = await response.json();
      // TODO - update the video with the bookmarked in toast
      alert(result.message);
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Failed to bookmark the video.");
    }
  };

  const handleRemoveBookmark = async (videoId: string) => {
    try {
      const response = await fetch("/api/bookmark", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error("Remove bookmark failed");
      }

      const result = await response.json();
      alert(result.message);

      setVideos(videos.filter((video) => video.id.videoId !== videoId));
    } catch (error) {
      console.error("Remove bookmark error:", error);
      alert("Failed to remove the bookmark.");
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchVideosData(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto mb-8">
        <SearchBar setSearchTerm={handleSearch} />
      </div>

      {error && (
        <div className="max-w-3xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center">
            <SearchIcon className="mr-3 text-red-500" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2Icon className="animate-spin text-blue-500 w-12 h-12" />
        </div>
      ) : (
        <>
          {videos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id.videoId}
                  video={video}
                  bookmarkVideo={handleBookmarkVideo}
                  removeBookmarkVideo={handleRemoveBookmark}
                  loading={loading}
                />
              ))}
            </div>
          )}

          {videos.length > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`
                        ${
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-gray-100 transition-colors"
                        }
                      `}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink className="px-4 py-2 bg-gray-100 rounded-md">
                      Page {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`
                        ${
                          !nextPageToken
                            ? "pointer-events-none opacity-50"
                            : "hover:bg-gray-100 transition-colors"
                        }
                      `}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
