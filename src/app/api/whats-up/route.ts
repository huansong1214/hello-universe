import { NextResponse } from 'next/server';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/playlistItems';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = 'PLTiv_XWHnOZrT_ppDGiT__fI3yjD4t7dI';

// Ensure API key is provided before proceeding.
if (!YOUTUBE_API_KEY) {
  throw new Error('Missing YOUTUBE_API_KEY environment variable.');
}

export async function GET() {
  try {
    // Fetch the latest video from the playlist (maxResults=1).
    const response = await fetch(
      `${YOUTUBE_API_URL}?part=snippet&maxResults=1&playlistId=${PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`
    );

    // Handle unsuccessful API response.
    if (!response.ok) {
      throw new Error('YouTube API error.');
    }

    const data = await response.json();
    const latestVideo = data.items[0];

    // Return relevant video details.
    return NextResponse.json({
      title: latestVideo.snippet.title,
      description: latestVideo.snippet.description,
      videoId: latestVideo.snippet.resourceId.videoId,
    });
  } catch (error) {
    // Log the error and return a 500 response.
    console.error('YouTube API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch from YouTube API.' },
      { status: 500 }
    );
  }
}
