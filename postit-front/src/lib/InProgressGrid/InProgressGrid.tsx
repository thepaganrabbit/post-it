"use client";

import { Form } from "react-bootstrap";
import PostIt from "@/lib/PostIt/PostIt";
import { PostItNote, SortableItemProps } from "@/types";
import styles from "./InProgressGrid.module.scss";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
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
      className={styles.gridItem}
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

export interface InProgressGridProps {
  postIts: PostItNote[];
  sortBy: "priority";
  onSortChange: (sortBy: "priority") => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
  onMarkInProgress?: (id: string) => void;
  onDoubleClick?: (id: string) => void;
  onReorder?: (postIts: PostItNote[]) => void;
}

const InProgressGrid = ({
  postIts,
  sortBy,
  onSortChange,
  onDelete,
  onComplete,
  onMarkInProgress,
  onDoubleClick,
  onReorder,
}: InProgressGridProps) => {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = postIts.findIndex((postIt) => postIt._id === active.id);
      const newIndex = postIts.findIndex((postIt) => postIt._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(postIts, oldIndex, newIndex);
        if (onReorder) {
          onReorder(newOrder);
        }
      }
    }
  };

  return (
    <div>
      <div className={styles.gridHeader}>
        <h2 className={styles.gridTitle}>In Progress</h2>
        <div className={styles.gridControls}>
          <div className={styles.gridControlGroup}>
            <label className={styles.gridControlLabel} htmlFor="in-progress-sort-by">
              Sort by
            </label>
            <Form.Select
              id="in-progress-sort-by"
              value={sortBy}
              onChange={(event) => onSortChange(event.target.value as "priority")}
            >
              <option value="priority">Priority</option>
            </Form.Select>
          </div>
          <div className={styles.gridControlSummary}>
            {postIts.length} item{postIts.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={postIts.map((n) => n._id)} strategy={rectSortingStrategy}>
          <div className={styles.grid}>
            {postIts.map((postIt) => {
              return (
                <SortableItem
                  key={postIt._id}
                  postIt={postIt}
                  onDelete={onDelete}
                  onComplete={onComplete}
                  onMarkInProgress={onMarkInProgress}
                  onDoubleClick={onDoubleClick ?? (() => undefined)}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {postIts.length === 0 && (
        <div className={styles.gridEmptyState}>No postIts in progress.</div>
      )}
    </div>
  );
};

export default InProgressGrid;
