"use client";

import KeyboardListener from "@/lib/KeyboardListener/KeyboardListener";
import GlobalCreateNoteModal from "@/lib/GlobalCreateNoteModal/GlobalCreateNoteModal";

export default function ClientProviders() {
  return (
    <>
      <KeyboardListener />
      <GlobalCreateNoteModal />
    </>
  );
}
