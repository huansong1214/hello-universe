import { NextRequest, NextResponse } from 'next/server';

const NASA_API_KEY = process.env.NASA_API_KEY;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rover: string }> },
) {
  if (!NASA_API_KEY) {
    return NextResponse.json(
      { message: 'Missing NASA_API_KEY environment variable.' },
      { status: 500 },
    );
  }

  const { rover } = await params;
  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[NASA Mars Photos API] ${response.status}: ${errorText}`);

      if (response.status === 404) {
        return NextResponse.json(
          { message: `Rover ${rover} not found.` },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { message: 'Failed to fetch data from NASA Mars Photos API.' },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      '[NASA Mars Photos API]',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { message: 'Unexpected server error. Please try again later.' },
      { status: 500 },
    );
  }
}
