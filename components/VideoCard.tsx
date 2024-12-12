import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, PlayCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Video } from "@/types";
import { formatViewCount, timeAgo, parseISO8601Duration } from "@/lib/helper";
import he from "he";

type VideoCardProps = {
  video: Video;
  loading?: boolean;
  bookmarkVideo: (video: Video) => void;
  removeBookmarkVideo: (videoId: string) => void;
  className?: string;
};

export const VideoCard = ({
  video,
  loading = false,
  bookmarkVideo,
  removeBookmarkVideo,
  className,
}: VideoCardProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    if (isBookmarked) {
      removeBookmarkVideo(video.id.videoId);
      setIsBookmarked(false);
    } else {
      bookmarkVideo(video);
      setIsBookmarked(true);
    }
  };

  if (loading) {
    return (
      <Card className={cn("w-full animate-pulse", className)}>
        <div className="aspect-video bg-muted rounded-t-lg" />
        <CardContent className="space-y-2 p-4">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "w-full group hover:shadow-lg transition-shadow",
        className
      )}
    >
      <CardHeader className="p-0 relative">
        <Link
          href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
          className="block"
          target="_blank"
        >
          <div className="relative aspect-video">
            <Image
              src={video.snippet.thumbnails.high.url}
              alt={he.decode(video.snippet.title)}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <PlayCircle className="text-white w-12 h-12" />
            </div>
            <Badge variant="secondary" className="absolute bottom-2 right-2">
              {parseISO8601Duration(video.contentDetails.duration)}
            </Badge>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/watch/${video.id.videoId}`}>
                <h3 className="font-semibold line-clamp-2 hover:text-primary">
                  {he.decode(video.snippet.title)}
                </h3>
              </Link>
            </TooltipTrigger>
            <TooltipContent>{he.decode(video.snippet.title)}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="text-muted-foreground text-sm">
          {he.decode(video.snippet.channelTitle)}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="text-muted-foreground text-xs">
          {formatViewCount(video.statistics.viewCount)} views •{" "}
          {timeAgo(video.snippet.publishedAt)}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleBookmark}>
                <Bookmark
                  className={cn(
                    "w-5 h-5",
                    isBookmarked
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};
