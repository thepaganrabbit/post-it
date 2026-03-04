"use client";

import { useCreatePostItModal, usePostItsNotes } from "@/store";
import CreateNoteModal from "@/lib/CreateNoteModal/CreateNoteModal";
import { PostItNote } from "@/types";

export default function GlobalCreateNoteModal() {
  const showCreatePostItModal = useCreatePostItModal((state) => state.showCreatePostItModal);

  const handleShowModal = (show: boolean) => {
    if (show) {
      useCreatePostItModal.getState().openCreatePostItModal();
    } else {
      useCreatePostItModal.getState().closeCreatePostItModal();
    }
  };
  
  const handleCreateNote = async (newPostIt: Omit<PostItNote, "_id">) => {
    await usePostItsNotes.getState().createPostIt(newPostIt);
    handleShowModal(false);
  };

  return (
    <CreateNoteModal 
      setModalState={handleShowModal} 
      modalState={showCreatePostItModal} 
      action={handleCreateNote} 
    />
  );
}
