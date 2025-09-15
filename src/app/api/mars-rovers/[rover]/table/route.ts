import { PageObjectResponse } from '@notionhq/client';
import { NextRequest, NextResponse } from 'next/server';

import { CameraInfo } from '@/features/mars-rovers/table/camera';
import { notion } from '@/features/mars-rovers/table/notion';

const NOTION_DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID!;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rover: string }> },
) {
  if (!NOTION_DATA_SOURCE_ID) {
    return NextResponse.json(
      { error: 'Missing NOTION_DATA_SOURCE_ID environment variable.' },
      { status: 500 },
    );
  }

  const { rover } = await params;

  try {
    // Query all rows from the Notion data source
    const response = await notion.dataSources.query({
      data_source_id: NOTION_DATA_SOURCE_ID,
    });

    // Convert each Notion page (database row) into a CameraInfo object
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

    // Filter cameras by rover
    const filtered = cameras.filter((camera) =>
      camera.rovers.some(
        (roverName) => roverName.toLowerCase() === rover.toLowerCase(),
      ),
    );

    return NextResponse.json(filtered);
  } catch (error) {
    console.error(
      '[Notion API]',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { error: 'Unexpected server error. Please try again later.' },
      { status: 500 },
    );
  }
}
