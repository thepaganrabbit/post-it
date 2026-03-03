"use client";

import EditModal from "@/lib/EditModal/EditModal";
import NoteBoard from "@/lib/NoteBoard/NoteBoard";
import SearchBar from "@/lib/SearchBar/SearchBar";
import { useEditModal, usePostItsNotes } from "@/store";
import { PostItNote } from "@/types";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";

const Backlog = () => {
  const [searchResults, setSearchResults] = useState<PostItNote[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [sortBy, setSortBy] = useState<"priority">("priority");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const postIts = usePostItsNotes((state) => state.postIts);
  const getPostIts = usePostItsNotes((state) => state.getPostIts);
  const editPostIt = usePostItsNotes((state) => state.editPostIt);
  const setInProgress = usePostItsNotes((state) => state.setInProgress);
  const tags = usePostItsNotes((state) => state.tags);
  const setCompletion = usePostItsNotes((state) => state.setCompleted);

  const engageModal = useEditModal((state) => state.engageModalState);
  const disengageModal = useEditModal((state) => state.closeModal);
  const modalState = useEditModal((state) => state.modalState);
  const postitToEdit = useEditModal((state) => state.postitId);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    getPostIts({ page, limit: pageSize, sort: sortBy }).finally(() => {
      if (isActive) {
        setIsLoading(false);
      }
    });
    return () => {
      isActive = false;
    };
  }, [getPostIts, page, pageSize, sortBy]);

  const handleDelete = async (id: string) => {
    await usePostItsNotes.getState().deletePostIt(id);
 
    if (searchResults.length > 0) {
      setSearchResults(searchResults.filter((postIt) => postIt._id !== id));
    }
    if (!postIts) return;
    usePostItsNotes.setState({ postIts: postIts.filter((postIt) => postIt._id !== id) });
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
      if (searchResults.length > 0) {
        setSearchResults(
          searchResults.map((postIt) =>
            postIt._id === id ? { ...postIt, completed: !postIt.completed } : postIt,
          ),
        );
      }
      if (!postIts) return;
      usePostItsNotes.setState({
        postIts: postIts.map((postIt) =>
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
      await getPostIts({ page, limit: pageSize, sort: sortBy });
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

  const handleEditModal = (id: string) => {
    engageModal(true, id);
  };

  if (isLoading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <>
      {modalState && modalState === true && (
        <EditModal
          modalState={modalState}
          setModalState={disengageModal}
          action={async (postIt: PostItNote) => {
            const success = await editPostIt(postIt);
            if (success) {
              toast("Post-it was updated", {
                autoClose: 5000,
                closeOnClick: true,
                type: "success",
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
              });
              await getPostIts({ page, limit: pageSize, sort: sortBy });
              disengageModal()
            } else {
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
          }}
          id={postitToEdit}
        />
      )}
      <SearchBar
        postIts={postIts || []}
        tags={tags || []}
        onSearchChange={setSearchResults}
        placeholder="Search your postIts..."
        darkMode={true}
      />
      <NoteBoard
        postIts={searchResults.length > 0 ? searchResults : postIts || []}
        setPage={setPage}
        setPageSize={setPageSize}
        setSortBy={setSortBy}
        sortBy={sortBy}
        handleComplete={handleComplete}
        handleDelete={handleDelete}
        handleMarkInProgress={handleMarkInProgress}
        onDoubleClick={handleEditModal}
        page={page}
        pageSize={pageSize}
        setPostIts={(updatedPostIts) => usePostItsNotes.setState({ postIts: updatedPostIts })}
      />
    </>
  );
};

export default Backlog;
