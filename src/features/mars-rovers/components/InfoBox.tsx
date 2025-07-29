import styles from './InfoBox.module.css';

type InfoBoxProps = {
    selectedCamera: {
        name: string;
        category: string;
        sol_count: number;
    } | null;
};

export function InfoBox({ selectedCamera }: InfoBoxProps) {
    return (
        <div className={styles.box}>
            <p>
                <span className={styles.label}>Camera</span>
                <span className={styles.value}>{selectedCamera?.name ?? ''}</span>
            </p>
            <p>
                <span className={styles.label}>Category</span>
                <span className={styles.value}>{selectedCamera?.category ?? ''}</span>
            </p>
            <p>
                <span className={styles.label}>Sol Count</span>
                <span className={styles.value}>{selectedCamera?.sol_count ?? ''}</span>
            </p>
        </div>
    );
}
