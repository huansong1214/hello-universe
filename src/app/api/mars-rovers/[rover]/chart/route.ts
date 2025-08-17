import { NextRequest, NextResponse } from "next/server";

const NASA_API_KEY = process.env.NASA_API_KEY;

interface PhotoDay {
    sol: number;
    cameras: string[];
}

interface ManifestResponse {
  photo_manifest: {
    photos: PhotoDay[];
  };
}

interface CameraUsage {
    name: string;
    sol_count: number;
    category: string;
}

// Camera category configuration.
const CAMERA_CATEGORIES: { [category: string]: RegExp[] } = {
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

// Helper: get camera category.
function getCameraCategory(camera: string): string {
  for (const [category, patterns] of Object.entries(CAMERA_CATEGORIES)) {
    if (patterns.some((pattern) => pattern.test(camera))) {
      return category;
    }
  }
  return 'Other';
}

// Helper: count sols per camera.
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
            { error: 'Missing NASA_API_KEY environment variable.'},
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

        const data = await response.json();
        const photos = data.photo_manifest.photos;

        // map camera usage
        const cameraSolsMap = new Map<string, Set<number>>();

        // count how many sols each camera was used
        photos.forEach((photoDay: PhotoDay) => {
            const sol = photoDay.sol;
            photoDay.cameras.forEach(camera => {
                if (!cameraSolsMap.has(camera)) {
                    cameraSolsMap.set(camera, new Set());
                }
                cameraSolsMap.get(camera)!.add(sol);
            });
        });

        // convert to an array of objects for visualization
        const items: CameraUsage[] = Array.from(cameraSolsMap.entries()).map(([camera, solsSet]) => ({
            name: camera,
            sol_count: solsSet.size,
            category: getCameraCategory(camera)
        }));

        return NextResponse.json(items);
    } catch (error) {
        console.error(`Error fetching manifest for ${rover}:`, error);
        return NextResponse.json(
            { error: 'Internal server error while fetching manifest.' },
            { status: 500 },
        );
    }

}
