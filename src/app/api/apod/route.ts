import { NextRequest, NextResponse } from 'next/server';

interface ApodData {
  date: string;
  explanation: string;
  title: string;
  url: string;
  media_type: 'image' | 'video';
}

const NASA_API_KEY = process.env.NASA_API_KEY;

export async function GET(req: NextRequest) {
  if (!NASA_API_KEY) {
    return NextResponse.json(
      { message: 'Missing NASA_API_KEY environment variable.' },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);

  // Query parameters: either a single date or a date range.
  const date = searchParams.get('date');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');

  // Build NASA APOD API URL.
  let apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

  if (startDate) {
    apiUrl += `&start_date=${startDate}`;
    if (endDate) {
      apiUrl += `&end_date=${endDate}`;
    }
  } else if (date) {
    apiUrl += `&date=${date}`;
  }

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[NASA APOD API] ${response.status}: ${errorText}`);
      return NextResponse.json(
        { message: 'Failed to fetch data from NASA APOD API.' },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Return array or single object depending on response shape.
    return Array.isArray(data)
      ? NextResponse.json(data as ApodData[])
      : NextResponse.json(data as ApodData);
  } catch (error) {
    console.error(
      '[NASA APOD API]',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { message: 'Unexpected server error. Please try again later.' },
      { status: 500 },
    );
  }
}
