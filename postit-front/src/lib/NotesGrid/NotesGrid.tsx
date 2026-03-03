"use client";

import { Form, Pagination } from "react-bootstrap";
import PostIt from "@/lib/PostIt/PostIt";
import { PostItsGridProps, PostItNote, SortableItemProps } from "@/types";
import styles from "./NotesGrid.module.scss";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";



const SortableItem = ({ postIt, onDelete, onComplete, onMarkInProgress, onDoubleClick }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: postIt._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.notesGridItem}
      {...attributes}
      {...listeners}
    >
      <PostIt
        {...postIt}
        onDelete={onDelete ?? (() => undefined)}
        onComplete={onComplete ?? (() => undefined)}
        onMarkInProgress={onMarkInProgress ?? (() => undefined)}
        onDoubleClick={onDoubleClick ?? (() => undefined)}
      />
    </div>
  );
};



const NotesGrid = ({
  postIts,
  page,
  pageSize,
  totalPages,
  totalItems,
  sortBy,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onDelete,
  onComplete,
  onMarkInProgress,
  onReorder,
  onDoubleClick,
}: PostItsGridProps) => {
  const safePostIts = postIts.filter(
    (postIt): postIt is PostItNote => Boolean(postIt && postIt._id)
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  

  const currentPage = Math.min(page, Math.max(1, totalPages));
  const startIndex = (currentPage - 1) * pageSize;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = safePostIts.findIndex((postIt) => postIt._id === active.id);
      const newIndex = safePostIts.findIndex((postIt) => postIt._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(safePostIts, oldIndex, newIndex);
        if (onReorder) {
          onReorder(newOrder);
        }
      }
    }
  };

  return (
    <div>
      <div className={styles.gridControls}>
        <div className={styles.gridControlGroup}>
          <label className={styles.gridControlLabel} htmlFor="sort-by">
            Sort by
          </label>
          <Form.Select
            id="sort-by"
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value as "priority")}
          >
            <option value="priority">Priority</option>
          </Form.Select>
        </div>
        <div className={styles.gridControlGroup}>
          <label className={styles.gridControlLabel} htmlFor="page-size">
            Per page
          </label>
          <Form.Select
            id="page-size"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </Form.Select>
        </div>
        <div className={styles.gridControlSummary}>
          Showing {totalItems === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + pageSize, totalItems)} of {totalItems}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={safePostIts.map((n) => n._id)} strategy={rectSortingStrategy}>
          <div className={styles.notesGrid}>
              {safePostIts.map((postIt) => {
              return (
                <SortableItem
                  key={postIt._id}
                  postIt={postIt}
                  onDoubleClick={onDoubleClick}
                  onDelete={onDelete}
                  onComplete={onComplete}
                  onMarkInProgress={onMarkInProgress}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {safePostIts.length === 0 && (
        <div className={styles.gridEmptyState}>No postIts to display.</div>
      )}

      <div className={styles.gridPagination}>
        <Pagination>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          />
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <Pagination.Item
                key={pageNumber}
                active={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            );
          })}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default NotesGrid;
