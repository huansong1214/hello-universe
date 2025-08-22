import styles from './InfoBox.module.css';

type InfoBoxProps = {
  selectedCamera: {
    name: string;
    category: string;
    sol_count: number;
  } | null;
};

function InfoBox({ selectedCamera }: InfoBoxProps) {
  return (
    <dl className={styles.box}>
      <dt className={styles.label}>Camera</dt>
      <dd className={styles.value}>{selectedCamera?.name ?? 'N/A'}</dd>

      <dt className={styles.label}>Category</dt>
      <dd className={styles.value}>{selectedCamera?.category ?? 'N/A'}</dd>

      <dt className={styles.label}>Sol Count</dt>
      <dd className={styles.value}>{selectedCamera?.sol_count ?? 'N/A'}</dd>
    </dl>
  );
}

export { InfoBox };
