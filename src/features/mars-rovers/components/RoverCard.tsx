import Link from 'next/link';

import { FlipCard } from 'features/mars-rovers/components/FlipCard';

import styles from './RoverCard.module.css';

type RoverCardProps = {
  name: string;
  status: string;
  launchDate: string;
  landingDate: string;
  totalPhotos: number;
};

const RoverCard = ({ name, status, launchDate, landingDate, totalPhotos }: RoverCardProps) => (
  <FlipCard
    key={name}
    frontContent={
      <div className={styles.imageContainer}>
        <div className={styles.roverName}>{name}</div>
        <img
          src={`/images/rover-${name.toLowerCase()}.jpg`}
          alt={`Mars Rover ${name}`}
        />
      </div>
    }
    backContent={

      <div>
        <h3>{name}</h3>
        <p>Status: {status}</p>
        <p>Launch: {launchDate}</p>
        <p>Landing: {landingDate}</p>
        <p>Photos: {totalPhotos.toLocaleString()}</p>
        <Link href={`/mars-rovers/${name.toLowerCase()}/camera`} passHref>
          <p className={styles.link}>View camera data</p>
        </Link>
      </div>
    }
  />
);

export default RoverCard;
