/**
 * SEARCHBAR COMPONENT INTEGRATION GUIDE
 * 
 * The SearchBar component provides:
 * - Fuzzy search through postIt titles, descriptions, tags, and priority
 * - Dropdown filter selector (Title & Description / Tags / Priority)
 * - onSearchChange callback to update parent component with filtered results
 * 
 * Props:
 * - postIts: PostItNote[] - Array of postIts to search through
 * - tags: string[] - Array of all available tags (optional, for reference)
 * - onSearchChange: (results: PostItNote[]) => void - Callback when search results change
 * - placeholder?: string - Custom placeholder text (default: "Search postIts...")
 * - className?: string - Additional CSS classes
 */

// =============================================================================
// EXAMPLE 1: BASIC INTEGRATION IN BACKLOG PAGE
// =============================================================================

import SearchBar from "@/lib/SearchBar/SearchBar";
import NoteBoard from "@/lib/NoteBoard/NoteBoard";
import { usePostItsNotes } from "@/store";
import { PostItNote } from "@/types";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

const BacklogPageWithSearch = () => {
  const [postIts, setPostIts] = useState<PostItNote[]>([]);
  const [searchResults, setSearchResults] = useState<PostItNote[]>([]);
  const postItsFromStore = usePostItsNotes(state => state.postIts);
  const tags = usePostItsNotes(state => state.tags);
  const getPostIts = usePostItsNotes((state) => state.getPostIts);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    getPostIts().finally(() => {
      if (isActive) {
        setIsLoading(false);
      }
    });
    return () => {
      isActive = false;
    };
  }, [getPostIts]);

  useEffect(() => {
    setPostIts(postItsFromStore || []);
    setSearchResults(postItsFromStore || []); // Initialize search results with all postIts
  }, [postItsFromStore]);

  // Display searchResults instead of postIts if search is active
  const displayPostIts = searchResults.length > 0 || postIts.length !== (postItsFromStore?.length || 0) 
    ? searchResults 
    : postIts;

  if (isLoading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div>
      {/* Add SearchBar at the top of your layout */}
      <SearchBar 
        postIts={postIts}
        tags={tags || []}
        onSearchChange={setSearchResults}
        placeholder="Search backlog..."
      />
      
      {/* Render displayPostIts instead of postIts */}
      <NoteBoard postIts={displayPostIts} />
    </div>
  );
};

// =============================================================================
// EXAMPLE 2: WITH LOCAL STATE MANAGEMENT (if you prefer to manage state locally)
// =============================================================================

const BacklogPageWithLocalSearch = () => {
  const [postIts, setPostIts] = useState<PostItNote[]>([]);
  const postItsFromStore = usePostItsNotes(state => state.postIts);
  const tags = usePostItsNotes(state => state.tags);
  const getPostIts = usePostItsNotes((state) => state.getPostIts);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchActive, setSearchActive] = useState(false);
  const [filteredPostIts, setFilteredPostIts] = useState<PostItNote[]>([]);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    getPostIts().finally(() => {
      if (isActive) {
        setIsLoading(false);
      }
    });
    return () => {
      isActive = false;
    };
  }, [getPostIts]);

  useEffect(() => {
    setPostIts(postItsFromStore || []);
  }, [postItsFromStore]);

  const handleSearchChange = (results: PostItNote[]) => {
    setFilteredPostIts(results);
    setSearchActive(results.length < postIts.length);
  };

  const displayPostIts = searchActive ? filteredPostIts : postIts;

  if (isLoading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div>
      <SearchBar 
        postIts={postIts}
        tags={tags || []}
        onSearchChange={handleSearchChange}
        placeholder="Search your postIts..."
      />
      <NoteBoard postIts={displayPostIts} />
    </div>
  );
};

// =============================================================================
// EXAMPLE 3: SEARCH BAR WITH ADDITIONAL FILTERING
// =============================================================================

const BacklogPageAdvanced = () => {
  const [postIts, setPostIts] = useState<PostItNote[]>([]);
  const [searchResults, setSearchResults] = useState<PostItNote[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const postItsFromStore = usePostItsNotes(state => state.postIts);
  const tags = usePostItsNotes(state => state.tags);
  const getPostIts = usePostItsNotes((state) => state.getPostIts);

  useEffect(() => {
    getPostIts();
  }, [getPostIts]);

  useEffect(() => {
    setPostIts(postItsFromStore || []);
    setSearchResults(postItsFromStore || []);
  }, [postItsFromStore]);

  // Apply both search and priority filter
  const displayPostIts = priorityFilter !== null 
    ? searchResults.filter(postIt => postIt.priority === priorityFilter)
    : searchResults;

  return (
    <div>
      <SearchBar 
        postIts={postIts}
        tags={tags || []}
        onSearchChange={setSearchResults}
        placeholder="Search postIts..."
      />

      {/* Additional priority filter */}
      <div>
        <select 
          value={priorityFilter ?? ""}
          onChange={(e) => setPriorityFilter(e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">All Priorities</option>
          <option value="0">Standard</option>
          <option value="1">Important</option>
          <option value="2">Top Priority</option>
        </select>
      </div>

      <NoteBoard postIts={displayPostIts} />
    </div>
  );
};

// =============================================================================
// FEATURES & FILTERING MODES
// =============================================================================

/**
 * SearchFilter Type: "title" | "tags" | "priority"
 * 
 * "title" (default):
 *   - Searches through postIt titles and descriptions
 *   - Fuzzy matching with threshold 0.3
 *
 * "tags":
 *   - Searches through postIt tags
 *   - Fuzzy matching with threshold 0.3
 *   - Best for finding postIts by tag keywords
 *
 * "priority":
 *   - Searches through priority values (0-2)
 *   - Searches by priority names: "Standard", "Important", "Top Priority"
 *   - Fuzzy matching with threshold 0.2
 */

export { BacklogPageWithSearch, BacklogPageWithLocalSearch, BacklogPageAdvanced };
