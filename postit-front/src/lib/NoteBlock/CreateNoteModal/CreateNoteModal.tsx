"use client";
import { CreateNoteModalProps } from "@/types";
import { wordCount } from "@/utils";
import { format } from "date-fns/format";
import React, { useEffect, useState } from "react";
import { Badge, Button, Form, Modal } from "react-bootstrap";
import { FloppyFill, Save, X } from "react-bootstrap-icons";

const FORM_ID = "create-note-form";

const CreateNoteModal = ({
  modalState,
  setModalState,
  action,
  editMode,
  note,
}: CreateNoteModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [validated, setValidated] = useState(false);
  useEffect(() => {
    if (editMode && note) {
      setTitle(note.title);
      setBody(note.body);
    }
  }, [note]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false || wordCount(body.trim()) > 200) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    action({
      title: title.trim(),
      body: body.trim(),
      createdAt: format(new Date(), "MM/dd/yyyy"),
    });
    setTitle("");
    setBody("");
    setValidated(false);
    setModalState(false);
  };

  return (
    <Modal show={modalState} style={{ marginTop: "10rem" }}>
      <Form id={FORM_ID} noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header>Create Note:</Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              <h2>Title</h2>
            </Form.Label>
            <Form.Control
              type="text"
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={validated && title.trim() === ""}
            />
            <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
              Title is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "2rem",
            }}
          >
            <Form.Label>
              <h3>Body</h3>
            </Form.Label>
            <Form.Control
              as="textarea"
              required
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
              }}
              isInvalid={validated && wordCount(body.trim()) > 200}
            ></Form.Control>
            <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
              Body must not exceed 200 words.
            </Form.Control.Feedback>
            <Badge>Word Count: {wordCount(body)}</Badge>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => {
            setTitle("");
            setBody("");
            setValidated(false);
            setModalState(false);
          }}>
            <X size={24} color="red" />
          </Button>
          {editMode ? (
            <Button variant="outline-dark" type="submit" form={FORM_ID}>
              <FloppyFill size={24} color="primary" />
            </Button>
          ) : (
            <Button variant="outline-dark" type="submit" form={FORM_ID}>
              <Save size={24} color="primary" />
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateNoteModal;
