import { NextResponse } from "next/server";
import { PageObjectResponse } from "@notionhq/client";

import { notion } from '@/features/mars-rovers/table/notion';
import { CameraInfo } from "@/features/mars-rovers/table/camera";

const databaseId = process.env.NOTION_DATABASE_ID!;

export async function GET() {
  if (!databaseId) {
    return NextResponse.json(
      { error: 'Missing NOTION_DATABASE_ID in environment variables.'},
      { status: 500 }
    );
  }

  try {
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

    return NextResponse.json(cameras, { status: 200 });
  } catch (error) {
    console.error('Error fetching Notion camera data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch camera data.'},
      { status: 500 }
    );
  }
}
