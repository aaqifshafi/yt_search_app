import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, ExternalLink, PlayCircle } from "lucide-react";
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
import { BookmarkVideo } from "@/types";
import { formatViewCount, timeAgo, parseISO8601Duration } from "@/lib/helper";
import he from "he";

type BookmarkCardProps = {
  data: BookmarkVideo;
  handleBookmark: (video: BookmarkVideo, isBookmarked: boolean) => void;
  isBookmarked: boolean;
  className?: string;
};

export const BookmarkCard = ({
  data,
  isBookmarked,
  handleBookmark,
  className,
}: BookmarkCardProps) => {
  return (
    <Card
      className={cn(
        "w-full group hover:shadow-lg transition-shadow",
        className
      )}
    >
      <CardHeader className="p-0 relative">
        <Link
          href={`https://www.youtube.com/watch?v=${data.videoId}`}
          target="_blank"
          className="block"
        >
          <div className="relative aspect-video">
            <Image
              src={data.thumbnailUrl}
              alt={he.decode(data.title)}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay with Play and External Link */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <PlayCircle className="text-white w-12 h-12 mr-4" />
              <ExternalLink className="text-white w-8 h-8" />
            </div>

            <Badge variant="secondary" className="absolute bottom-2 right-2">
              {parseISO8601Duration(data.duration)}
            </Badge>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="p-4 flex space-x-3">
        <Link
          href={`https://www.youtube.com/channel/${data.channelId}`}
          target="_blank"
          className="self-start"
        >
          <Image
            width={40}
            height={40}
            src={data.channelThumbnail}
            alt={he.decode(data.channelTitle)}
            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-red-500 transition-colors"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={`https://www.youtube.com/watch?v=${data.videoId}`}
                  target="_blank"
                >
                  <h3
                    className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors"
                    title={he.decode(data.title)}
                  >
                    {he.decode(data.title)}
                  </h3>
                </Link>
              </TooltipTrigger>
              <TooltipContent>{he.decode(data.title)}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="mt-1">
            <div className="text-xs text-muted-foreground truncate max-w-full">
              {he.decode(data.channelTitle)}
            </div>
            <div className="text-xs text-muted-foreground flex items-center space-x-1 mt-0.5">
              <span>{formatViewCount(data.viewCount)} views</span>
              <span>•</span>
              <span>{timeAgo(data.publishedAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-red-50 rounded-full"
                onClick={() => handleBookmark(data, isBookmarked)}
              >
                <Bookmark
                  className={cn(
                    "w-6 h-6 transition-all duration-300",
                    isBookmarked
                      ? "text-red-500 fill-red-500 hover:text-red-600"
                      : "text-muted-foreground hover:text-red-500"
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
