import { NextRequest, NextResponse } from 'next/server';

const NASA_API_KEY = process.env.NASA_API_KEY;

if (!NASA_API_KEY) {
    throw new Error('Missing NASA_API_KEY environment variable.');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rover: string }> },
) {
  try {
    const { rover } = await params;

    const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${NASA_API_KEY}`;

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('NASA Mars Rover Photos API error.');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error fetching Mars rover manifest:`, error);
    return NextResponse.json(
      { error: 'Internal server error while fetching manifest.' },
      { status: 500 },
    );
  }
}
