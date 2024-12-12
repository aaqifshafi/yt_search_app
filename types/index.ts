export interface Video {
  videoId: string;
  contentDetails: { duration: string };
  id: {
    videoId: string;
  };
  snippet: {
    description: string;
    channelId: string;
    title: string;
    channelTitle: string;
    viewCount: string;
    publishedAt: string;
    channelThumbnail: string;
    thumbnails: {
      high: { url: string };
    };
  };
  statistics: {
    viewCount: number;
  };
  channel: {
    channelId: string;
    thumbnails: {
      default: { url: string };
    };
    snippet: {
      title: string;
      customUrl: string;
    };
  };
}

export type BookmarkVideo = {
  channelId: string;
  id: string;
  videoId: string;
  channelThumbnail: string;
  channelTitle: string;
  duration: string;
  publishedAt: string;
  thumbnailUrl: string;
  title: string;
  viewCount: number;
};
