import { NextRequest, NextResponse } from "next/server";

// Define the structure of NASA APOD data.
interface ApodData {
  date: string;
  explanation: string;
  title: string;
  url: string;
  media_type: 'image' | 'video';
}

// Get NASA API key from environment variables.
const NASA_API_KEY = process.env.NASA_API_KEY;

// Validate the presence of the API key.
if (!NASA_API_KEY) {
  throw new Error('Missing NASA_API_KEY environment variable.');
}

// Handle GET requests to this API route.
export async function GET(req: NextRequest) {
  // extract parameters from URL
  const { searchParams } = new URL(req.url);

  // Extract optional query parameters.
  const date = searchParams.get('date');
  const start_date = searchParams.get('start_date');
  const end_date = searchParams.get('end_date');

  // Start building the NASA API URL.
  let apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

  // Add date or date range parameters if provided.
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
    // Fetch data from the NASA APOD API with no cache.
    const response = await fetch(apiUrl, { cache: 'no-store' });

    // Handle non-successful responses.
    if (!response.ok) {
      throw new Error('NASA APOD API error.');
    }

    // Parse the JSON response.
    const data = await response.json();

    // Return response as JSON: either a single item or an array.
    if (Array.isArray(data)) {
      return NextResponse.json(data as ApodData[]);
    } else {
      return NextResponse.json(data as ApodData);
    }

  } catch (error) {
    // Log error details on the server side.
    if (error instanceof Error) {
      console.error('NASA APOD API error:', error.message);
    } else {
      console.error('NASA APOD API error: An unknown error occurred.');
    }

    // Return a safe, user-friendly error message.
    return NextResponse.json(
      { message: 'Failed to fetch NASA APOD data. Please try again later.' },
      { status: 500 }
    );
  }
}
