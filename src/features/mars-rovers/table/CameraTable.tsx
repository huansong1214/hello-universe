import { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

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
      <Table className={styles.cameraTable}>
        <Thead>
          <Tr>
            <Th>Abbreviation</Th>
            <Th>Full Name</Th>
            <Th>Category</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedCameras.map((camera) => (
            <Tr key={camera.abbreviation}>
              <Td>{camera.abbreviation}</Td>
              <Td>{camera.fullName}</Td>
              <Td>{camera.category}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
