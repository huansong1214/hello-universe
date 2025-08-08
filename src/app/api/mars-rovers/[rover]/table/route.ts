import { NextRequest, NextResponse } from "next/server";
import { PageObjectResponse } from "@notionhq/client";

import { notion } from '@/features/mars-rovers/table/notion';
import { CameraInfo } from "@/features/mars-rovers/table/camera";

const databaseId = process.env.NOTION_DATABASE_ID!;

if (!databaseId) {
  throw new Error('Missing NOTION_DATABASE_ID in environment variables.');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rover: string }> },
) {
  try {
    const { rover } = await params;

    const response = await notion.databases.query({ database_id: databaseId });

    const cameras: CameraInfo[] = response.results
      .filter((page): page is PageObjectResponse => page.object === 'page')
      .map((page) => {
        const properties = page.properties;

        return {
          abbreviation:
          properties.Abbreviation.type === 'title' &&
          properties.Abbreviation.title.length > 0
            ? properties.Abbreviation.title[0].plain_text
            : 'Unknown',

          fullName:
          properties.FullName.type === 'rich_text' &&
          properties.FullName.rich_text.length > 0
            ? properties.FullName.rich_text[0].plain_text
            : 'Unknown',

          category:
          properties.Category.type === 'select'
            ? properties.Category.select?.name ?? 'Unknown'
            : 'Unknown',

          rovers:
          properties.Rovers.type === 'multi_select'
            ? properties.Rovers.multi_select.map((item) => item.name)
            : [],
        };
      });

    const filtered = cameras.filter(camera =>
      camera.rovers.some(r => r.toLowerCase() === rover.toLowerCase())
    );

    return NextResponse.json(filtered, { status: 200 });
  } catch (error) {
    console.error('Error fetching Notion camera data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch camera data.'},
      { status: 500 }
    );
  }
}
