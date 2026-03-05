import React from 'react';
import { Container } from 'react-bootstrap';
import styles from "./page.module.scss";
import MainPage from '@/lib/MainPage/MainPage';
import NotesPage from '@/lib/NotesPage/NotesPage';

const Home = () => {

  return (
    <Container className={styles.containerHome}>
     <MainPage />
     <NotesPage />
    </Container>
  );
};

export default Home;