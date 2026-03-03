"use client";

import React from "react";
import styles from "./NotePad.module.scss";
import { NotePadProps } from "@/types";

const NotePad = ({ note }: NotePadProps) => {
  return note ? (
    <div className={styles.NotePadBox}>
      <h1>{note.title}</h1>
      <hr />
      <p>{note.body}</p>
    </div>
  ) : (
    <div className={styles.NotePadBox}>
      <h4>....</h4>
    </div>
  );
};

export default NotePad;
