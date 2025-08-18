import { PageObjectResponse } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

import { CameraInfo } from '@/features/mars-rovers/table/camera';
import { notion } from '@/features/mars-rovers/table/notion';

const databaseId = process.env.NOTION_DATABASE_ID!;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rover: string }> },
) {
  if (!databaseId) {
    return NextResponse.json(
      { error: 'Missing NOTION_DATABASE_ID in environment variables.' },
      { status: 500 },
    );
  }

  const { rover } = await params;

  try {
    // Query all rows from the Notion database.
    const response = await notion.databases.query({ database_id: databaseId });

    // Convert each Notion page (database row) into a CameraInfo object.
    const cameras: CameraInfo[] = response.results
      .filter((page): page is PageObjectResponse => page.object === 'page')
      .map((page) => {
        const properties = page.properties;

        return {
          abbreviation:
            properties.Abbreviation.type === 'title'
              ? (properties.Abbreviation.title?.[0]?.plain_text ?? 'Unknown')
              : 'Unknown',

          fullName:
            properties.FullName.type === 'rich_text'
              ? (properties.FullName.rich_text?.[0]?.plain_text ?? 'Unknown')
              : 'Unknown',

          category:
            properties.Category.type === 'select'
              ? (properties.Category.select?.name ?? 'Unknown')
              : 'Unknown',

          rovers:
            properties.Rovers.type === 'multi_select'
              ? properties.Rovers.multi_select.map(
                  (roverOption) => roverOption.name,
                )
              : [],
        };
      });

    // Filter cameras by rover.
    const filtered = cameras.filter((camera) =>
      camera.rovers.some(
        (roverName) => roverName.toLowerCase() === rover.toLowerCase(),
      ),
    );

    return NextResponse.json(filtered, { status: 200 });
  } catch (error) {
    console.error('Error fetching Notion camera data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch camera data.' },
      { status: 500 },
    );
  }
}
