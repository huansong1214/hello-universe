import { NextResponse } from 'next/server';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = 'PLTiv_XWHnOZrT_ppDGiT__fI3yjD4t7dI';

if (!YOUTUBE_API_KEY) {
  throw new Error('Missing YOUTUBE_API_KEY environment variable.');
}

export async function GET() {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API error.');
    }

    const data = await response.json();
    const latestVideo = data.items[0];

    return NextResponse.json({
      title: latestVideo.snippet.title,
      description: latestVideo.snippet.description,
      videoId: latestVideo.snippet.resourceId.videoId,
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from YouTube API.' },
      { status: 500 }
    );
  }
}
