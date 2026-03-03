import React from 'react';
import { Container } from 'react-bootstrap';
import styles from "./page.module.scss";
import MainPage from '@/lib/MainPage/MainPage';
import EditModal from '@/lib/EditModal/EditModal';

const Home = () => {

  return (
    <Container className={styles.containerHome}>
     <MainPage />
    </Container>
  );
};

export default Home;