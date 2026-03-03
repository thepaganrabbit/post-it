import React from 'react';
import styles from './DashBox.module.scss';
import { Badge, Button, Container } from 'react-bootstrap';
import { DashBoxProps } from '@/types';
import { Arrow90degUp } from 'react-bootstrap-icons';

const DashBox = ({title, count, action, bio}: DashBoxProps) => {
    return (
        <Container className={styles.boxContain}>
            <div className={styles.title}>
                <div>
                    <h2>{title}</h2>
                </div>
            <Badge pill className={styles.pillBox}>
                {count}
            </Badge>
            </div>
            <div className="bio">
                {bio}
            </div>
            <div className={styles.actions}>
                <Button onClick={action}>
                    <Arrow90degUp size={24} />
                </Button>
            </div>
        </Container>
    );
};

export default DashBox;