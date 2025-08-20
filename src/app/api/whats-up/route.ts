import { NextResponse } from 'next/server';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = 'PLTiv_XWHnOZrT_ppDGiT__fI3yjD4t7dI';

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'Missing YOUTUBE_API_KEY environment variable.' },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[YouTube Data API] ${response.status}: ${errorText}`);

      return NextResponse.json(
        { error: 'Failed to fetch data from YouTube Data API.' },
        { status: response.status },
      );
    }

    const data = await response.json();
    const latestVideo = data.items[0];

    if (!latestVideo) {
      return NextResponse.json(
        { error: 'No videos found in the playlist.' },
        { status: 404 },
      );
    }

    const { title, description, resourceId } = latestVideo.snippet;

    return NextResponse.json({
      title,
      description,
      videoId: resourceId.videoId,
    });
  } catch (error) {
    console.error(
      '[YouTube Data API]',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { error: 'Unexpected server error. Please try again later.' },
      { status: 500 },
    );
  }
}
