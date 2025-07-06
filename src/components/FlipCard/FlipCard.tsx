import React from "react";

import styles from './FlipCard.module.css';

interface FlipCardProps {
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
}

function FlipCard({ frontContent, backContent }: FlipCardProps): JSX.Element {
    return (
        <div className={styles.flipCard}>
            <div className={styles.flipCardInner}>
                <div className={styles.flipCardFront}>
                    {frontContent}
                </div>
                <div className={styles.flipCardBack}>
                    {backContent}
                </div>
            </div>
        </div>
    );
}

export { FlipCard };
