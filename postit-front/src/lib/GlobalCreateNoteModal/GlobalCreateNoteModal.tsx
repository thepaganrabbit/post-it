"use client";

import { useCreatePostItModal } from "@/store";
import CreateNoteModal from "@/lib/CreateNoteModal/CreateNoteModal";

export default function GlobalCreateNoteModal() {
  const showCreatePostItModal = useCreatePostItModal((state) => state.showCreatePostItModal);

  const handleShowModal = (show: boolean) => {
    if (show) {
      useCreatePostItModal.getState().openCreatePostItModal();
    } else {
      useCreatePostItModal.getState().closeCreatePostItModal();
    }
  };

  return <CreateNoteModal show={showCreatePostItModal} onShow={handleShowModal} />;
}
