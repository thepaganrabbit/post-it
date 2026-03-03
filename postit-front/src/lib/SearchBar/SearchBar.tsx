"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Search, XCircle } from "react-bootstrap-icons";
import Fuse from "fuse.js";
import { PostItNote } from "@/types";
import styles from "./SearchBar.module.scss";

export type SearchFilter = "title" | "tags" | "priority";

interface SearchBarProps {
  postIts: PostItNote[];
  tags: string[];
  onSearchChange: (results: PostItNote[]) => void;
  placeholder?: string;
  className?: string;
  darkMode?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  postIts,
  tags,
  onSearchChange,
  placeholder = "Search postIts...",
  className = "",
  darkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<SearchFilter>("title");

  // Configure Fuse.js based on filter mode
  const fuseOptions = useMemo(() => {
    switch (filterMode) {
      case "tags":
        return {
          keys: ["tags"],
          threshold: 0.3,
          minMatchCharLength: 1,
        };
      case "priority":
        return {
          keys: ["priority"],
          threshold: 0.2,
          minMatchCharLength: 1,
        };
      case "title":
      default:
        return {
          keys: ["title", "description"],
          threshold: 0.3,
          minMatchCharLength: 1,
        };
    }
  }, [filterMode]);

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(postIts, fuseOptions);
  }, [postIts, fuseOptions]);

  // Perform fuzzy search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return postIts;
    }

    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [searchQuery, fuse, postIts]);

  // Update parent component with results
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        onSearchChange(postIts);
        return;
      }

      const results = fuse.search(query);
      onSearchChange(results.map((result) => result.item));
    },
    [fuse, postIts, onSearchChange]
  );

  const handleClear = () => {
    setSearchQuery("");
    onSearchChange(postIts);
  };

  const getPriorityLabel = (priority: number | undefined) => {
    switch (priority) {
      case 2:
        return "Top Priority";
      case 1:
        return "Important";
      case 0:
      default:
        return "Standard";
    }
  };

  return (
    <div className={`${styles.searchBarContainer} ${darkMode ? styles.darkMode : ""} ${className}`}>
      <div className={styles.searchInputWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className={styles.searchInput}
          aria-label="Search postIts"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear search"
            title="Clear search"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>

      <div className={styles.filterWrapper}>
        <label htmlFor="search-filter" className={styles.filterLabel}>
          Filter by:
        </label>
        <select
          id="search-filter"
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value as SearchFilter)}
          className={styles.filterDropdown}
        >
          <option value="title">Title & Description</option>
          <option value="tags">Tags</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      {searchResults.length === 0 && searchQuery && (
        <div className={styles.noResults}>
          No postIts found matching your search.
        </div>
      )}

      {searchResults.length > 0 && searchQuery && (
        <div className={styles.resultsInfo}>
          Found {searchResults.length} postIt{searchResults.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
