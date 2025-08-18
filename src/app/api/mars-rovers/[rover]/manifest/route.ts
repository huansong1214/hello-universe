import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rover: string }> },
) {
  const { rover } = await params;

  const NASA_API_KEY = process.env.NASA_API_KEY;

  if (!NASA_API_KEY) {
    return NextResponse.json(
      { error: 'Missing NASA_API_KEY environment variable.' },
      { status: 500 },
    );
  }

  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      return NextResponse.json(
        { error: `Rover ${rover} not found.` },
        { status: 404 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `NASA API error (status ${response.status}).` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching manifest for ${rover}:`, error);

    return NextResponse.json(
      { error: `Internal server error while fetching manifest for ${rover}.` },
      { status: 500 },
    );
  }
}
