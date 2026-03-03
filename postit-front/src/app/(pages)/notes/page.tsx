"use client";
import React, { useEffect, useState } from "react";
import NoteBlock from "@/lib/NoteBlock/NoteBlock";
import NotePad from "@/lib/NoteBlock/NotePad/NotePad";
import { Container, Spinner } from "react-bootstrap";
import styles from "./Notes.module.scss";
import FloatingActionButton from "@/lib/FloatingActionButton/FloatingActionButton";
import CreateNoteModal from "@/lib/NoteBlock/CreateNoteModal/CreateNoteModal";
import { useNote } from "@/store";
import { Note } from "@/types";

const NotesPage = () => {
  const [newNoteModalState, setNewNoteModalState] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [noteToEdit, setNoteToEdit] = useState<Note | undefined>(undefined);
  const [activeNote, setActiveNote] = useState<Note | undefined>(undefined);
  const isLoading = useNote((state) => state.isLoading);
  const notes = useNote((state) => state.notes);
  const getNotes = useNote((state) => state.getNotes);
  const createNote = useNote((state) => state.createNote);
  const updateNote = useNote((state) => state.updateNote);
  const deleteNote = useNote((state) => state.deleteNote);

  useEffect(() => {
    if (!notes) {
      getNotes();
    }
  }, [notes, getNotes]);

  useEffect(() => {
    if (notes && notes.length > 0 && !isLoading) {
      setActiveNote(notes[0]);
    }
  }, [notes, isLoading]);

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  return (
    <Container style={{ color: "white" }}>
      <CreateNoteModal
        modalState={newNoteModalState}
        setModalState={setNewNoteModalState}
        editMode={editMode}
        note={noteToEdit}
        action={async (note) => {
          if (editMode && noteToEdit) {
            await updateNote({ ...note, _id: noteToEdit._id });
            setEditMode(false);
            setNoteToEdit(undefined);
          } else {
            await createNote(note);
          }
        }}
      />
      <h1>Notes Page</h1>
      <div className={styles.drawerBlock}>
        <NoteBlock
          notes={notes || []}
          deleteAction={async (id) => {
            await deleteNote(id);
          }}
          editAction={async (id) => {
            const noteToEdit = notes?.find((note) => note._id === id);
            setNoteToEdit(noteToEdit || undefined);
            setNewNoteModalState(true);
            setEditMode(true);
          }}
          viewAction={(id) => {
            if (id)
              setActiveNote(() => {
                return notes?.filter((note) => note._id === id)[0];
              });
          }}
        />
        <NotePad note={activeNote} />
      </div>
      <FloatingActionButton
        onClick={setNewNoteModalState}
        currentState={newNoteModalState}
      />
    </Container>
  );
};

export default NotesPage;
