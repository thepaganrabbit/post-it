"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import styles from "./CreateNoteModal.module.scss";
import {
  CheckCircleFill,
  XCircleFill,
} from "react-bootstrap-icons";
import { extractTags, priorityFromTitle, processString, removeHash, removeSymbol, removeTags, trimPunctuation } from "@/utils";
import { ModalProps, PostItNote } from "@/types";
import { usePostItsNotes } from "@/store";
 import { format } from "date-fns";
import { THEME } from "@/theme";

const CreateNoteModal = ({ modalState,action, setModalState}: ModalProps<Omit<PostItNote, "_id">>) => {
  const [mounted, setMounted] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<number>(0);
  const createPostit = usePostItsNotes((state) => state.createPostIt);
  const titleRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => setModalState(false);
  const handleSave = async () => {
    let colors = {
      bgColor: THEME.postItColors.standard.bgColor,
      foldColor: THEME.postItColors.standard.foldColor,
    };
    switch(priority) {
      case 0: 
        colors = {
          bgColor: THEME.postItColors.standard.bgColor,
          foldColor: THEME.postItColors.standard.foldColor,
        }
        break;
      case 1: 
        colors = {
          bgColor: THEME.postItColors.important.bgColor,
          foldColor: THEME.postItColors.important.foldColor,
        } 
        break;
      case 2: 
        colors = {
          bgColor: THEME.postItColors.topPriority.bgColor,
          foldColor: THEME.postItColors.topPriority.foldColor,
        }
        break;
    }
    const newPostIt: Omit<PostItNote, "_id"> = {
      tags: trimPunctuation(extractTags(description)),
      title,
      description: processString(removeHash(description)),
      priority: Number(priority),
      createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      dismissed: false,
      completed: false,
      bgColor: colors.bgColor,
      foldColor: colors.foldColor,
    }
    action(newPostIt);
    setTitle('');
    setDescription('');
    setPriority(0);
    setModalState(false);
  };

  return (
    <>
      {mounted && (
        <Modal
          show={modalState}
          onHide={handleClose}
          onEntered={() => {
            if (titleRef.current) {
              titleRef.current.focus();
              titleRef.current.select();
            }
          }}
          backdrop="static" // optional: prevents closing on outside click
          keyboard={false} // optional: disables Esc key close
          style={{
            color: "white",
            position: "absolute",

            zIndex: 9320309239029023,
          }} // custom inline styles if needed
          dialogClassName={styles.modalContainer} // optional custom class
        >
      <Modal.Header closeButton>
        <Modal.Title>Create PostIt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Form>
            <Form.Group>
              <Form.Label className="mr-2">Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                ref={titleRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTitle(e.target.value)
                }}
                onBlur={(e) => {
                  console.log(Number(priorityFromTitle(e.target.value)));
                  setPriority(() => {
                    return priorityFromTitle(e.target.value);
                  });
                  setTitle(removeSymbol(removeTags(e.target.value), "!").trim());
                }}
                style={{ borderBottom: "1px solid white" }}
                placeholder="postIt title..."
              />
            </Form.Group>
            <Form.Group
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "2rem",
              }}
            >
              <Form.Label className="mr-2">Description</Form.Label>
              <textarea
                style={{ borderBottom: "1px solid white" }}
                rows={5}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setDescription(e.target.value)
                }}
                placeholder="postIt description..."
              />
            </Form.Group>
            <Form.Group style={{ marginTop: '1rem', textAlign: 'center'}}>
              <Form.Label>Priority</Form.Label>
              <Form.Select aria-label="priority of the post-it task" 
              style={{marginLeft: '1rem'}}
              value={priority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setPriority(Number(e.target.value));
              }}
              >
                <option value="0">Standard</option>
                <option value="1">Important</option>
                <option value="2">Top Priority</option>
              </Form.Select>
            </Form.Group>
          
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.modalActions}>
        <Button onClick={handleClose}>
          <XCircleFill size={24} color="red" />
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <CheckCircleFill size={24} color="blue" />
        </Button>
      </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CreateNoteModal;
