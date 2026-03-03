"use client";

import { useCreatePostItModal } from "@/store";
import { useEffect } from "react";

export default function KeyboardListener() {
  const openCreatePostItModal = useCreatePostItModal((state) => state.openCreatePostItModal);
  const closeCreatePostItModal = useCreatePostItModal((state) => state.closeCreatePostItModal);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+. (or Cmd+. on Mac) to open modal
      if ((e.ctrlKey || e.metaKey) && e.key === ".") {
        e.preventDefault();
        e.stopPropagation();
        openCreatePostItModal();
      }
      
      // Check for Ctrl+/ (or Cmd+/ on Mac) to close modal
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        e.stopPropagation();
        closeCreatePostItModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [openCreatePostItModal, closeCreatePostItModal]);

  return null;
}
