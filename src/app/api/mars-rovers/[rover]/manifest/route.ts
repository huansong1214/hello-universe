import { NextRequest, NextResponse } from 'next/server';

const NASA_API_KEY = process.env.NASA_API_KEY;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rover: string }> },
) {
  if (!NASA_API_KEY) {
    return NextResponse.json(
      { error: 'Missing NASA_API_KEY environment variable' },
      { status: 500 },
    );
  }

  const { rover } = await params;

  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch manifest from ${rover}` },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error Fetching manifest for ${rover}:`, error);
    return NextResponse.json(
      { error: 'Internal server error while fetching manifest' },
      { status: 500 },
    );
  }
}
