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
    // entry, descent, landing
    if (
        camera.startsWith('EDL') ||
        camera === 'LCAM' ||
        camera === 'ENTRY'
    ) {
        return 'Entry, Descent, Landing';
    }
    // other
    return 'Other';
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ rover: string }> },
) {
    if (!NASA_API_KEY) {
        return NextResponse.json(
            { error: 'Missing NASA_API_KEY environment variable'},
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
        const photos = data.photo_manifest.photos;

        // map camera usage
        let cameraSolsMap = new Map<string, Set<number>>();

        // count how many sols each camera was used
        photos.forEach((photoDay: PhotoDay) => {
            let sol = photoDay.sol;
            photoDay.cameras.forEach(camera => {
                if (!cameraSolsMap.has(camera)) {
                    cameraSolsMap.set(camera, new Set());
                }
                cameraSolsMap.get(camera)!.add(sol);
            });
        });

        // convert to an array of objects for visualization
        let items = Array.from(cameraSolsMap.entries()).map(([camera, solsSet]) => ({
            name: camera,
            sol_count: solsSet.size,
            category: getCameraCategory(camera)
        }));

        return NextResponse.json(items);
    } catch (error) {
        console.error(`Error fetching manifest for ${rover}:`, error);
        return NextResponse.json(
            { error: 'Internal server error while fetching manifest' },
            { status: 500 },
        );
    }

}
