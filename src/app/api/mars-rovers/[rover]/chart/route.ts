import { NextRequest, NextResponse } from "next/server";

const NASA_API_KEY = process.env.NASA_API_KEY;

// types for response data
interface PhotoDay {
    sol: number;
    cameras: string[];
}

interface CameraUsage {
    name: string;
    sol_count: number;
    category: string;
}

// get camera category
function getCameraCategory(camera: string) {
    // engineering
    if (
        camera.includes('NAV') ||
        camera.includes('HAZ')
    ) {
        return 'Engineering';
    }
    // science
    if (
        camera.startsWith('MCZ') ||
        camera.startsWith('CHEM') ||
        camera.startsWith('MAST') ||
        camera === 'SKYCAM' ||
        camera === 'SHERLOC_WATSON' ||
        camera === 'SUPERCAM_RMI' ||
        camera === 'MAHLI' ||
        camera === 'MARDI' ||
        camera === 'PANCAM' ||
        camera === 'MINITES'
    ) {
        return 'Science';
    }
    // entry/descent/landing
    if (
        camera.startsWith('EDL') ||
        camera === 'LCAM' ||
        camera === 'ENTRY'
    ) {
        return 'Entry/Descent/Landing';
    }
    // other
    return 'Other';
}

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

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('NASA Mars Rover Photos API error.');
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
      console.error(`Error fetching Mars rover manifest:`, error);
      return NextResponse.json(
          { error: 'Internal server error while fetching manifest.' },
          { status: 500 },
      );
  }
}
