"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./MainPage.module.scss";
import DashBox from "@/lib/DashBox/DashBox";
import { Container } from "react-bootstrap";
import CountBlock from "../CountBlock/CountBlock";
import { usePostItsNotes } from "@/store";

const MainPage = () => {
  const postIts = usePostItsNotes((state) => state.postIts);
  const getPostIts = usePostItsNotes((state) => state.getPostIts);
  const counts = usePostItsNotes((state) => state.counts);
  const navigation = useRouter();

  useEffect(() => {
    if (!postIts) {
      getPostIts(); // this can be async inside the store
    }
  }, [postIts, getPostIts, counts]);

  return (
    <Container className={styles.containerHome}>
      <div className={styles.todos}>
        <CountBlock counts={counts} />
      </div>
      <div className={styles.todos}>
        <DashBox
          title="Backlog"
          count={counts.todos}
          bio={
            <p>
              You have a total of{" "}
              <em style={{ color: "red", fontWeight: 900 }}>{counts.todos}</em> todos
              available in the backlog.
            </p>
          }
          action={() => {
            navigation.push('/backlog');
          }}
        />
      
      </div>
      <div className={styles.todos}>
          <DashBox
          title="In Progress"
          count={counts.inProgress}
          bio={
            <p>
              You have a total of{" "}
              <em style={{ color: "red", fontWeight: 900 }}>{counts.inProgress}</em> in progress at the moment
            </p>
          }
          action={() => {
            navigation.push('/in-progress');   
          }}
        />
      </div>
    </Container>
  );
};

export default MainPage;
