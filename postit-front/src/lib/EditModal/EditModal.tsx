"use client";
import { usePostItsNotes } from "@/store";
import { EditModalProps, PostItNote } from "@/types";
import React, { useEffect } from "react";
import { Button, ButtonGroup, Col, Form, Modal, Spinner } from "react-bootstrap";
import { Save, X } from "react-bootstrap-icons";
import styles from "../CreateNoteModal/CreateNoteModal.module.scss";
import {
  extractTags,
  priorityFromTitle,
  processString,
  removeHash,
  removeSymbol,
  removeTags,
  trimPunctuation,
} from "@/utils";
import Omit from "lodash.omit";
import { THEME } from "@/theme";

const EditModal = ({
  modalState,
  setModalState,
  id,
  action,
}: EditModalProps) => {
  const [postIt, setPostIt] = React.useState<PostItNote | null>(null);
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [priority, setPriority] = React.useState<number>(0);
  const titleRef = React.useRef<HTMLInputElement | null>(null);

  const postIts = usePostItsNotes((state) => state.postIts);
  const postItsInProgress = usePostItsNotes((state) => state.postItsInProgress);
  const isLoading = usePostItsNotes((state) => state.isLoading);

  useEffect(() => {
    let postItToEdit = null;
    
    // Check in postIts list first
    if (postIts && postIts.length > 0) {
      postItToEdit = postIts.find((postIt) => postIt._id === id);
    }
    
    // If not found, check in postItsInProgress list
    if (!postItToEdit && postItsInProgress && postItsInProgress.length > 0) {
      postItToEdit = postItsInProgress.find((postIt) => postIt._id === id);
    }
    
    if (postItToEdit) {
      setPostIt(postItToEdit);
      setTitle(postItToEdit.title || "");
      setDescription(postItToEdit.description || "");
      setPriority(postItToEdit.priority || 0);
    }
  }, [postIts, postItsInProgress, id]);

  const handleSubmit = () => {
    if (postIt) {
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
      const cleanedPodstit = Omit(postIt, [
        "title",
        "description",
        "priority",
        "tags",
        "bgColor",
        "foldColor",
      ]);
      action({
        tags: trimPunctuation(extractTags(description)),
        title,
        description: processString(removeHash(description)),
        priority: Number(priority),
        bgColor: colors.bgColor,
        foldColor: colors.foldColor,
        ...cleanedPodstit,
      });
    }
  };

  if (isLoading || title.length <= 0 || description.length <= 0) {
    return <Spinner color="primary" />;
  }

  return (
    <Modal
      show={modalState}
      onHide={() => setModalState(false)}
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
        marginTop: "10rem",
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
                  setTitle(e.target.value);
                }}
                onBlur={(e) => {
                  console.log(Number(priorityFromTitle(e.target.value)));
                  setPriority(() => {
                    return priorityFromTitle(e.target.value);
                  });
                  setTitle(
                    removeSymbol(removeTags(e.target.value), "!").trim(),
                  );
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
                  setDescription(e.target.value);
                }}
                placeholder="postIt description..."
              />
            </Form.Group>
            <Form.Group style={{ marginTop: "1rem", textAlign: "center" }}>
              <Form.Label>Priority</Form.Label>
              <Form.Select
                aria-label="priority of the post-it task"
                style={{ marginLeft: "1rem" }}
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
      <Modal.Footer style={{ background: "rgba(22,22,22,0.9)" }}>
        <Button
          variant="outline"
          style={{
            display: "flex",
            color: "white",
            flexDirection: "row",
            border: "0.1rem solid red",
          }}
          onClick={() => setModalState(false)}
        >
          <X size={24} color="red" style={{ marginRight: "1rem" }} />
          <label htmlFor="close">Close</label>
        </Button>
        <Button
          variant="outline"
          style={{
            display: "flex",
            color: "white",
            flexDirection: "row",
            border: "0.1rem solid blue",
          }}
          onClick={handleSubmit}
        >
          <Save size={24} style={{ marginRight: "1rem", color: "yellow" }} />
          <label htmlFor="update">Update</label>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditModal;
