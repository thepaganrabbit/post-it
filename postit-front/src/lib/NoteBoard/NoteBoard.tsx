"use client";

import { Container } from "react-bootstrap";
import { PostItBoardProps, PostItNote } from "@/types";
import FloatingActionButton from "@/lib/FloatingActionButton/FloatingActionButton";
import NotesGrid from "@/lib/NotesGrid/NotesGrid";
import { usePostItsNotes, useCreatePostItModal } from "@/store";

export default function NoteBoard({
  postIts,
  page,
  pageSize,
  sortBy,
  setPostIts,
  handleComplete,
  handleDelete,
  setPage,
  setPageSize,
  setSortBy,
  onDoubleClick,
  handleMarkInProgress,
}: PostItBoardProps) {
  const pagination = usePostItsNotes((state) => state.pagination);
  const showCreatePostItModal = useCreatePostItModal((state) => state.showCreatePostItModal);
  const openCreatePostItModal = useCreatePostItModal((state) => state.openCreatePostItModal);

  const handleReorder = (reorderedPostIts: PostItNote[]) => {
    setPostIts(reorderedPostIts);
  };

  return (
    <Container className="py-5">
      <NotesGrid
        postIts={postIts}
        page={page}
        pageSize={pageSize}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        sortBy={sortBy as "priority"}
        onPageChange={(nextPage) => setPage(nextPage)}
        onPageSizeChange={(nextSize) => {
          setPage(1);
          setPageSize(nextSize);
        }}
        onSortChange={(nextSort) => {
          setPage(1);
          setSortBy(nextSort);
        }}
        onDelete={handleDelete}
        onComplete={handleComplete}
        onMarkInProgress={handleMarkInProgress}
        onReorder={handleReorder}
        onDoubleClick={onDoubleClick}
      />
      <FloatingActionButton
        onClick={() => openCreatePostItModal()}
        currentState={showCreatePostItModal}
      />
    </Container>
  );
}
