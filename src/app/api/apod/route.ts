import { NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');

  let apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

  if (start_date) {
    apiUrl += `&start_date=${start_date}`;
    if (end_date) {
      apiUrl += `&end_date=${end_date}`;
    }
  } else if (date) {
    apiUrl += `&date=${date}`;
  }

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch NASA APOD data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return NextResponse.json(data as ApodData[]);
    } else {
      return NextResponse.json(data as ApodData);
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: 'Error fetching NASA APOD data', error: message },
      { status: 500 }
    );
  }
}
