import { NextRequest, NextResponse } from 'next/server';

const NASA_API_KEY = process.env.NASA_API_KEY;

// Represents camera activity on a single sol (Martian day).
interface PhotoDay {
  sol: number;
  cameras: string[];
}

// Response from NASA API manifest endpoint.
interface ManifestResponse {
  photo_manifest: {
    photos: PhotoDay[];
  };
}

// Output format: camera usage with category and number of sols.
interface CameraUsage {
  name: string;
  sol_count: number;
  category: string;
}

// Mapping of camera names to categories for classification.
const CAMERA_CATEGORIES: Record<string, RegExp[]> = {
  Engineering: [/NAV/, /HAZ/],
  Science: [
    /^MCZ/,
    /^CHEM/,
    /^MAST/,
    /^SKYCAM$/,
    /^SHERLOC_WATSON$/,
    /^SUPERCAM_RMI$/,
    /^MAHLI$/,
    /^MARDI$/,
    /^PANCAM$/,
    /^MINITES$/,
  ],
  'Entry/Descent/Landing': [/^EDL/, /^LCAM$/, /^ENTRY$/],
};

// Determine the category of a camera based on predefined regex patterns.
function getCameraCategory(camera: string): string {
  for (const [category, patterns] of Object.entries(CAMERA_CATEGORIES)) {
    if (patterns.some((pattern) => pattern.test(camera))) {
      return category;
    }
  }
  return 'Other';
}

// Count the number of sols each camera has been active, avoiding duplicates per sol.
function countCameraSols(photos: PhotoDay[]): Map<string, number> {
  const cameraSolCount = new Map<string, number>();

  photos.forEach((photoDay) => {
    const countedCameras = new Set<string>();
    photoDay.cameras.forEach((camera) => {
      if (!countedCameras.has(camera)) {
        cameraSolCount.set(camera, (cameraSolCount.get(camera) || 0) + 1);
        countedCameras.add(camera);
      }
    });
  });

  return cameraSolCount;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rover: string }> },
) {
  if (!NASA_API_KEY) {
    return NextResponse.json(
      { error: 'Missing NASA_API_KEY environment variable.' },
      { status: 500 },
    );
  }

  const { rover } = await params;
  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${NASA_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch manifest from ${rover}.` },
        { status: response.status },
      );
    }

    const data: ManifestResponse = await response.json();
    const photos = data.photo_manifest.photos;

    // Count sols per camera using helper.
    const cameraSolCount = countCameraSols(photos);

    // Convert Map to array of CameraUsage objects.
    const items: CameraUsage[] = Array.from(cameraSolCount.entries()).map(
      ([camera, sol_count]) => ({
        name: camera,
        sol_count,
        category: getCameraCategory(camera),
      }),
    );

    return NextResponse.json(items);
  } catch (error) {
    console.error(`Error fetching manifest for ${rover}:`, error);
    return NextResponse.json(
      { error: 'Internal server error while fetching manifest.' },
      { status: 500 },
    );
  }
}
