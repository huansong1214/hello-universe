import { NextResponse } from "next/server";

interface ApodData {
  date: string;
  explanation: string;
  title: string;
  url: string;
  media_type: 'image' | 'video';
}

const NASA_API_KEY = process.env.NASA_API_KEY;

if (!NASA_API_KEY) {
  throw new Error('Missing NASA_API_KEY environment variable');
}

export async function GET() {
  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch NASA APOD data' },
        { status: response.status }
      );
    }

    const apod: ApodData = await response.json();
    return NextResponse.json(apod);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
      { message: 'Error fetching APOD data', error: error.message },
      { status: 500 }
    );
    } else {
      return NextResponse.json(
        { message: 'Unknown error fetching NASA APOD data', error: String(error) },
        { status: 500 }
      );
    }
  }
}
