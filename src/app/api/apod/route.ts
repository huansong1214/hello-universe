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
  throw new Error('Missing NASA_API_KEY environment variable.');
}

export async function GET(req: NextRequest) {
  // extract parameters from URL
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');

  let apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

  // build API URL based on parameters
  if (start_date) {
    apiUrl += `&start_date=${start_date}`;
    if (end_date) {
      apiUrl += `&end_date=${end_date}`;
    }
  } else if (date) {
    apiUrl += `&date=${date}`;
  }

  // try to fetch data
  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('NASA APOD API error.');
    }

    const data = await response.json();

    // return data as JSON
    if (Array.isArray(data)) {
      return NextResponse.json(data as ApodData[]);
    } else {
      return NextResponse.json(data as ApodData);
    }

  } catch (error) {
    // log error
    if (error instanceof Error) {
      console.error('NASA APOD API error: ', error.message);
    } else {
      console.error('NASA APOD API error: An unknown error occurred.')
    }

    // return the response with an error message
    return NextResponse.json(
      { error: 'Failed to fetch NASA APOD data.' },
      { status: 500 }
    );
  }
}
