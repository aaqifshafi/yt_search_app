"use server";
import { NextResponse } from "next/server";
import axios from "axios";
import { Video } from "@/types";

export async function POST(request: Request) {
  const { searchTerm, pageToken } = await request.json();
  const apiKey = process.env.YOUTUBE_API_KEY;

  try {
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${searchTerm}&key=${apiKey}&maxResults=10`;
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }
    const response = await axios.get(url);
    const items = response.data.items;

    const videoDetailsPromises = items.map(async (video: Video) => {
      const videoId = video.id.videoId;
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoId}&key=${apiKey}`;
      const detailsResponse = await axios.get(detailsUrl);
      const statistics = detailsResponse.data.items[0].statistics;
      const contentDetails = detailsResponse.data.items[0].contentDetails;

      const channelId = video.snippet.channelId;
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
      const channelResponse = await axios.get(channelUrl);
      const channel = channelResponse.data.items[0].snippet;
      console.log(contentDetails);
      return {
        ...video,
        contentDetails,
        statistics,
        channel,
      };
    });

    const detailedVideos = await Promise.all(videoDetailsPromises);

    return NextResponse.json({
      videos: detailedVideos,
      nextPageToken: response.data.nextPageToken,
      prevPageToken: response.data.prevPageToken,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Error fetching videos" },
      { status: 500 }
    );
  }
}
