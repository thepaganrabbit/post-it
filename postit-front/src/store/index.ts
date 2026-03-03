import {
  ButtonPositioningState,
  DrawerState,
  EditModalState,
  PostItState,
  PostItNote,
  CreatePostItModalState,
  UseNoteState,
  Note,
} from "@/types";
import { sortCompletedPostIts } from "@/utils";
import axios from "axios";
import omit from "lodash.omit";
import { Bounce, toast } from "react-toastify";
import { create } from "zustand";

const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export const useDrawer = create<DrawerState>((set) => ({
  drawerState: false,
  toggleDrawer: () => set((state) => ({ drawerState: !state.drawerState })),
}));

export const usePostItsNotes = create<PostItState>((set, get) => ({
  postIts: null,
  postItsInProgress: null,
  completedPostIts: null,
  tags: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    sort: "priority",
  },
  isLoading: false,
  counts: {
    total: 0,
    todos: 0,
    completed: 0,
    inProgress: 0,
  },
  getPostIts: async (query) => {
    try {
      set({ isLoading: true });
      const current = get().pagination;
      const page = query?.page ?? current.page;
      const limit = query?.limit ?? current.limit;
      const sort = query?.sort ?? current.sort;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (sort) params.set("sort", sort);

      const { data } = await axios.get(
        `${url}/api/postit?${params.toString()}`,
      );
      set({ counts: data.docCounts });

      set({
        postIts: data.payload.backlog,
        postItsInProgress: data.payload.inProgress,
        completedPostIts: data.payload.completed,
        pagination: {
          page: data.page ?? page,
          limit,
          total: data.total ?? 0,
          totalPages: data.totalPages ?? 1,
          sort,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching postIts:", error);
      set({ isLoading: false });
    }
  },
  createPostIt: async (postIt) => {
    try {
      set({ isLoading: true });
      await axios.post(`${url}/api/postit`, postIt);
      await usePostItsNotes.getState().getPostIts();
      set({ isLoading: false });
    } catch (error) {
      console.error("Error creating postIt:", error);
      set({ isLoading: false });
    }
  },
  deletePostIt: async (id) => {
    try {
      set({ isLoading: true });
      const { status } = await axios.delete(`${url}/api/postit/${id}`);
      if (status !== 204) throw new Error("failed to delete");
      await usePostItsNotes.getState().getPostIts();
      toast("Post-it was deleted", {
        autoClose: 5000,
        closeOnClick: true,
        type: "success",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      set({ isLoading: false });
    } catch (error) {
      console.error("Error creating postIt:", error);
      set({ isLoading: false });
      toast("Post-it failed to be deleted", {
        autoClose: 5000,
        closeOnClick: true,
        type: "error",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  },
  setInProgress: async (id) => {
    try {
      const { status } = await axios.post(
        `${url}/api/postit/inProgress?id=${id}`,
      );
      if (status !== 202) throw new Error("failed to update");
      const postIts = usePostItsNotes.getState().postIts;
      set({
        postIts: postIts?.filter(
          (postIt) => postIt && postIt.inProgress === false,
        ),
        postItsInProgress: postIts?.filter(
          (postIt) => postIt && postIt.inProgress === true,
        ),
      });
      return true;
    } catch (error) {
      console.error("Error creating postIt:", error);
      set({ isLoading: false });
      return false;
    }
  },
  sortCompleted: (): PostItNote[] | undefined => {
    const postIts = usePostItsNotes.getState().postIts;
    if (!postIts) return undefined;
    const sortedPostIts = sortCompletedPostIts(postIts);
    set({ completedPostIts: sortedPostIts });
    return sortedPostIts;
  },
  setCompleted: async (id) => {
    try {
      set({ isLoading: true });
      const { status } = await axios.post(
        `${url}/api/postit/isCompleted?id=${id}`,
      );
      if (status !== 202) throw new Error("failed to update");
      const postIts = usePostItsNotes.getState().postIts;
      set({
        postIts: postIts?.filter(
          (postIt) => postIt && postIt.completed === false,
        ),
        completedPostIts: postIts?.filter(
          (postIt) => postIt && postIt.completed === true,
        ),
      });
      return true;
    } catch (error) {
      console.error("Error creating postIt:", error);
      toast("Failed to set post-it to complete");
      set({ isLoading: false });
      return false;
    }
  },
  editPostIt: async (postit: PostItNote) => {
    try {
      set({ isLoading: true });
      const {
        status,
        data: { payload },
      } = await axios.put<{ payload: PostItNote[] }>(
        `${url}/api/postit/${postit._id}`,
        omit(postit, ["_id", "updatedAt", "__v"]),
      );
      if (status !== 200) throw new Error("failed to update");
      console.log("in method", payload);
      set({
        postIts: payload
          ?.filter((postIt: PostItNote) => postIt && postIt.completed === false)
          .filter((postIt: PostItNote) => postIt && !postIt.inProgress),
        completedPostIts: payload?.filter(
          (postIt) => postIt && postIt.completed === true,
        ),
        postItsInProgress: payload.filter(
          (postIt: PostItNote) => postIt && postIt.inProgress,
        ),
      });
      return true;
    } catch (error) {
      console.error("Error updating postIt:", error);
      toast("Failed to set update postIt");
      set({ isLoading: false });
      return false;
    }
  },
}));

export const useEditModal = create<EditModalState>((set) => ({
  modalState: false,
  postitId: "",
  engageModalState: (modalState: boolean, id: string) =>
    set(() => ({ postitId: id, modalState })),
  closeModal: () => set(() => ({ modalState: false })),
}));

export const useButtonPositioningState = create<ButtonPositioningState>(
  (set) => ({
    position: "bottom-0 right-0",
  }),
);

export const useNote = create<UseNoteState>((set, get) => ({
  notes: null,
  isLoading: false,
  getNotes: async () => {
    try {
      const { data } = await axios.get<{ payload: Note[] }>(`${url}/api/notes`);
      set({
        notes: data.payload,
      });
      toast("Notes were retrieved", {
        autoClose: 5000,
        closeOnClick: true,
        type: "success",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      return data.payload;
    } catch (error) {
      console.error(error);
      toast("Unable to get notes!", {
        autoClose: 5000,
        closeOnClick: true,
        type: "error",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  },
  createNote: async (note: Note) => {
    try {
      const { data } = await axios.post(`${url}/api/notes`, note);
      const currentNotes = get().notes;
      set({
        notes: currentNotes ? [...currentNotes, data.payload] : [data.payload],
      });
      toast("Post-it was updated", {
        autoClose: 5000,
        closeOnClick: true,
        type: "success",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error(error);
      toast("Unable to update postit!", {
        autoClose: 5000,
        closeOnClick: true,
        type: "error",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  },
  updateNote: async (note: Note) => {
    try {
      const { data } = await axios.put(
        `${url}/api/notes/${note._id}`,
        omit(note, ["_id"]),
      );
      const currentNotes = get().notes;
      const noteRemoved = currentNotes?.filter(
        (cNotes) => note && cNotes._id !== note._id,
      );
      const notes = noteRemoved
        ? [...noteRemoved, data.payload]
        : [data.payload];
      set({
        notes,
      });
      toast("Post-it was updated", {
        autoClose: 5000,
        closeOnClick: true,
        type: "success",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error(error);
      toast("Unable to update postit!", {
        autoClose: 5000,
        closeOnClick: true,
        type: "error",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  },
  deleteNote: async (id: string) => {
    try {
      const { status } = await axios.delete(`${url}/api/notes/${id}`);
      if (status !== 204) {
        throw new Error("Failed to delete note");
      }
      const currentNotes = get().notes;

      set({
        notes: currentNotes?.filter((note) => note._id !== id),
      });
      toast("Note successfully deleted", {
        autoClose: 5000,
        closeOnClick: true,
        type: "success",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error(error);
      toast("Unable to delete note!", {
        autoClose: 5000,
        closeOnClick: true,
        type: "error",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  },
}));

export const useCreatePostItModal = create<CreatePostItModalState>((set) => ({
  showCreatePostItModal: false,
  toggleCreatePostItModal: () =>
    set((state) => ({ showCreatePostItModal: !state.showCreatePostItModal })),
  openCreatePostItModal: () => set({ showCreatePostItModal: true }),
  closeCreatePostItModal: () => set({ showCreatePostItModal: false }),
}));
