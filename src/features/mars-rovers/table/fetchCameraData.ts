import { notion } from './notion';
import { CameraInfo } from './camera';
import { PageObjectResponse } from '@notionhq/client';

const databaseId = process.env.NOTION_DATABASE_ID!;

if (!databaseId) {
  throw new Error('Missing NOTION_DATABASE_ID in environment variables.');
}

export async function fetchCameraData(): Promise<CameraInfo[]> {
  const response = await notion.databases.query({ database_id: databaseId });

  return response.results.map((page) => {
    const properties = (page as PageObjectResponse).properties;

    return {
      abbreviation: properties.Abbreviation.type === 'title'
        ? properties.Abbreviation.title[0]?.plain_text ?? 'Unknown'
        : 'Unknown',

      fullName: properties.FullName.type === 'rich_text'
        ? properties.FullName.rich_text[0]?.plain_text ?? 'Unknown'
        : 'Unknown',

      category: properties.Category.type === 'select'
        ? properties.Category.select?.name ?? 'Unknown'
        : 'Unknown',

      rovers: properties.Rovers.type === 'multi_select'
        ? properties.Rovers.multi_select.map((item) => item.name)
        : [],
    };
  });
}
