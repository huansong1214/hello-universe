'use client';

import { CameraInfo } from "./camera";

interface Props {
  cameras: CameraInfo[];
}

export function CameraTable({ cameras }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Abbreviation</th>
          <th>Full Name</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {cameras.map((camera) => (
          <tr key={camera.abbreviation}>
            <td>{camera.abbreviation}</td>
            <td>{camera.fullName}</td>
            <td>{camera.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
