
"use client"

import NoteBoard from '@/lib/NoteBoard/NoteBoard';
import SearchBar from '@/lib/SearchBar/SearchBar';
import { usePostItsNotes } from '@/store';
import { PostItNote } from '@/types';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast, Bounce } from 'react-toastify';

const Archive = () => {
  const postIts = usePostItsNotes(state => state.completedPostIts);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [sortBy, setSortBy] = useState<"priority">("priority");
  const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchResults, setSearchResults] = useState<PostItNote[]>([]);

  const getPostIts = usePostItsNotes((state) => state.getPostIts);
  const setInProgress = usePostItsNotes((state) => state.setInProgress);
  const setCompletion = usePostItsNotes((state) => state.setCompleted);
  const tags = usePostItsNotes((state) => state.tags);


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

  const handleDelete = (id: string) => {
    if (!postIts) return;
    usePostItsNotes.setState({ completedPostIts: postIts.filter((postIt) => postIt._id !== id) });
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
      if (!postIts) return;
      usePostItsNotes.setState({
        completedPostIts: postIts.map((postIt) =>
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

  if (isLoading && postIts) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <>
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
      page={page}
      onDoubleClick={() => null}
      pageSize={pageSize}
      setPostIts={(updatedPostIts) => usePostItsNotes.setState({ completedPostIts: updatedPostIts })}
    />
    </>
  );
};

export default Archive;