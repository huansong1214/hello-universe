import { useEffect, useState } from "react";

import { CameraInfo } from "./camera";

import styles from './CameraTable.module.css';

export default function CameraTable({ rover }: { rover: string }) {
  const [cameras, setCameras] = useState<CameraInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCameraData() {
      try {
        const response = await fetch(`/api/mars-rovers/${rover}/table`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data: CameraInfo[] = await response.json();

        setCameras(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCameraData();
  }, [rover]);

  const CATEGORIES: string[] = ['Engineering', 'Science', 'Entry/Descent/Landing'];

  const sortedCameras = [...cameras].sort(
    (a, b) =>
      CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category)
  );

  if (loading) return <p className={styles.loading}>Loading cameras...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.cameraTableContainer}>
      <table className={styles.cameraTable}>
        <thead>
          <tr>
            <th>Abbreviation</th>
            <th>Full Name</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {sortedCameras.map((camera) => (
            <tr key={camera.abbreviation}>
              <td>{camera.abbreviation}</td>
              <td>{camera.fullName}</td>
              <td>{camera.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
