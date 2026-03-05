import React from "react";

export type Theme = {
    colors: {
        primary: string;
    },
    postItColors: {
        standard: {
            bgColor: string;
            foldColor: string;
        },
        important: {
            bgColor: string;
            foldColor: string;
        },
        topPriority: {
            bgColor: string;
            foldColor: string;
        }
    }
}

export interface Note {
  _id?:string;
  title: string;
  body: string;
  createdAt: string;
}

export interface PostitCounts {
  total: number;
  todos: number;
  inProgress: number;
  completed: number;
}

export interface DrawerState {
    drawerState: boolean;
  toggleDrawer: () => void;
}

export interface EditModalState {
  modalState: boolean;
  postitId: string;
  engageModalState: (state: boolean, id: string) => void;
  closeModal: () => void;
}

export interface CreatePostItModalState {
  showCreatePostItModal: boolean;
  toggleCreatePostItModal: () => void;
  openCreatePostItModal: () => void;
  closeCreatePostItModal: () => void;
}

export interface UseNoteState {
  notes: Note[] | null;
  isLoading: boolean;
  getNotes: () => Promise<Note[] | undefined>;
  createNote: (note: Note) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export interface PostItState {
    postIts: PostItNote[] | null;
    postItsInProgress: PostItNote[] | null;
    completedPostIts: PostItNote[] | null;
    tags: string[] | null;
    pagination: PostItsPagination;
    isLoading: boolean;
    counts: PostitCounts;
    getPostIts: (query?: PostItsQuery) => Promise<void>;
    createPostIt: (postIt: Omit<PostItNote, "_id">) => Promise<void>;
    editPostIt: (postit: PostItNote) => Promise<void | boolean>;
    setInProgress: (id:string) => Promise<boolean>;
    setCompleted: (id:string) => Promise<boolean>;
    sortCompleted: () => PostItNote[] | undefined;
    deletePostIt: (id: string) => Promise<void>;
}

export interface PostItsQuery {
  page?: number;
  limit?: number;
  sort?: "priority";
}

export interface PostItsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  sort?: "priority";
}


export interface ButtonPositioningState {
    position: 'bottom-0 right-0' | 'bottom-0 left-0' | 'top-0 right-0' | 'top-0 left-0';
}

export interface PostItNote {
  _id: string;
  title: string;
  description: string;
  priority?: number;
  completed?: boolean;
  completedOn?: string | null;
  inProgress?: boolean;
  dismissed?:boolean; 
  bgColor?: string;
  createdAt: string;
  foldColor?: string;
  tags?: string[];
}

export interface ModalProps<T=string>{
  modalState: boolean;
  setModalState: (state: boolean) => void;
  action: (item: T) => void
}

export interface DoubleClick<T = string> {
  onDoubleClick: (id: T) => void;
}

export interface SharedActions {
  deleteAction?: (id: string) => void;
  editAction?: (id: string) => void;
  viewAction?: (id: string) => void;
}

export interface PostItProps extends PostItNote, DoubleClick {
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onMarkInProgress?: (id: string) => void;
}

export interface ActionButtonProps {
  onClick: (e: boolean) => void;
  currentState: boolean
}

export interface DashBoxProps {
  count: number;
  title:string;
  bio: React.ReactElement;
  action: () => void;
}

export interface CountBlockProps {
  counts: PostitCounts;
}

export interface SortableItemProps extends DoubleClick {
  postIt: PostItNote;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
  onMarkInProgress?: (id: string) => void;
}

export interface EditModalProps extends ModalProps<PostItNote> {
  id: string;
}

export interface PostItsGridProps extends DoubleClick{
  postIts: PostItNote[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  sortBy: "priority";
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sortBy: "priority") => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
  onMarkInProgress?: (id: string) => void;
  onReorder?: (postIts: PostItNote[]) => void;
}


export interface PostItBoardProps extends DoubleClick {
  postIts: PostItNote[];
  page: number;
  pageSize: number;
  sortBy: string;
  setPage: (page: number) => void;
  setPageSize: (page: number) => void;
  setSortBy: (sortBy: 'priority') => void;
  setPostIts: (postIt: PostItNote[]) => void;
  handleComplete: (id: string) => void;
  handleDelete: (id: string) => void;
  handleMarkInProgress: (id: string) => void;
}

export interface NoteBlockProps extends SharedActions {
  notes: Note[];
}

export interface NoteChipProps extends SharedActions {
  id?: string;
  title: string;
  date: string;
}

export interface NotePageProps {
  displayTitle: boolean;
}

export interface NotePadProps {
 note: Note | undefined;
}

export interface CreateNoteModalProps extends ModalProps<Note> {
  editMode: boolean;
  note?: Note;
}
