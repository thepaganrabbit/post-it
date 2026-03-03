"use client";

import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { PostItNote } from "@/types";
import CreateNoteModal from "@/lib/CreateNoteModal/CreateNoteModal";
import FloatingActionButton from "@/lib/FloatingActionButton/FloatingActionButton";
import InProgressGrid from "@/lib/InProgressGrid/InProgressGrid";
import { usePostItsNotes } from "@/store";
import { Bounce, toast } from "react-toastify";
import SearchBar from "@/lib/SearchBar/SearchBar";

export default function InProgressPage() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<PostItNote[]>([]);
  const [sortBy, setInProgressSortBy] = useState<"priority">("priority");

  const postItsFromApi = usePostItsNotes((state) => state.postItsInProgress);
  const setInProgress = usePostItsNotes((state) => state.setInProgress);
  const setCompletion = usePostItsNotes((state) => state.setCompleted);
  const getPostIts = usePostItsNotes((state) => state.getPostIts);
  const tags = usePostItsNotes((state) => state.tags);


  useEffect(() => {
    getPostIts({ sort: sortBy });
  }, [getPostIts, sortBy]);

  const handleDelete = async (id: string) => {
    await usePostItsNotes.getState().deletePostIt(id);
 
    if (!postItsFromApi) return;
    usePostItsNotes.setState({
      postItsInProgress: postItsFromApi.filter((postIt) => postIt._id !== id),
    });
  };

  const handleComplete = async (id: string) => {
    const success = await setCompletion(id);
    if (success) {
         toast("Post-it is no longer in progress...", {
        autoClose: 5000,
        closeOnClick: true,
        type: "success",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      if (!postItsFromApi) return;
      usePostItsNotes.setState({
        postItsInProgress: postItsFromApi.map((postIt) =>
          postIt._id === id ? { ...postIt, completed: !postIt.completed } : postIt,
        ),
      });
    } else {
      toast("Unable to take post-it out of progress!", {
        autoClose: 5000,
        closeOnClick: true,
        type: "error",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
   
  };

  const handleMarkInProgress = async (id: string) => {
    const success = await setInProgress(id);
    if (success) {
         toast("Post-it is no longer in progress...", {
        autoClose: 5000,
        closeOnClick: true,
        type: "success",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
      if (!postItsFromApi) return;
      usePostItsNotes.setState({
        postItsInProgress: postItsFromApi.filter((postIt) => postIt._id !== id),
      });
    } else {
      toast("Unable to take post-it out of progress!", {
        autoClose: 5000,
        closeOnClick: true,
        type: "error",
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleReorder = (reorderedPostIts: PostItNote[]) => {
    usePostItsNotes.setState({ postItsInProgress: reorderedPostIts });
  };
  const handleCreateNote = async (newPostIt: Omit<PostItNote, "_id">) => {
    await usePostItsNotes.getState().createPostIt(newPostIt);
    await getPostIts({ sort: sortBy });
  };

  return (
    <Container className="py-5">
       <SearchBar
        postIts={postItsFromApi || []}
        tags={tags || []}
        onSearchChange={setSearchResults}
        placeholder="Search your postIts..."
        darkMode={true}
      />
      <InProgressGrid
        postIts={searchResults.length > 0 ? searchResults : postItsFromApi || []}
        sortBy={sortBy}
        onSortChange={setInProgressSortBy}
        onDelete={handleDelete}
        onComplete={handleComplete}
        onMarkInProgress={handleMarkInProgress}
        onReorder={handleReorder}
      />
      <FloatingActionButton
        onClick={() => setShowModal(true)}
        currentState={showModal}
      />
      {showModal && <CreateNoteModal action={handleCreateNote} modalState={showModal} setModalState={setShowModal} />}
    </Container>
  );
}
