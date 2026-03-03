"use client";

import { NoteBlockProps } from "@/types";
import React, { useState, useMemo } from "react";
import { ListGroup, Spinner } from "react-bootstrap";
import NoteChip from "./NoteChip/NoteChip";
import { format } from "date-fns/format";
import { useNote } from "@/store";
import Fuse from "fuse.js";
import { Search, XCircle } from "react-bootstrap-icons";

const NoteBlock = ({
  notes,
  deleteAction,
  editAction,
  viewAction,
}: NoteBlockProps) => {
  const isLoading = useNote((state) => state.isLoading);
  const [searchQuery, setSearchQuery] = useState("");

  // Configure Fuse.js for fuzzy search on notes
  const fuse = useMemo(() => {
    if (!notes) return null;
    return new Fuse(notes, {
      keys: ["title", "body"],
      threshold: 0.3,
      minMatchCharLength: 1,
    });
  }, [notes]);

  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (!searchQuery.trim()) return notes;

    const results = fuse?.search(searchQuery);
    return results?.map((result) => result.item) || [];
  }, [searchQuery, fuse, notes]);

  const handleClear = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return <Spinner color="primary" />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Search
          size={20}
          style={{
            position: "absolute",
            left: "0.75rem",
            color: "#999",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.75rem 0.75rem 0.75rem 2.5rem",
            border: "2px solid white",
            borderRadius: "8px",
            fontSize: "1rem",
            backgroundColor: "transparent",
            color: "white",
            outline: "none",
          }}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#999",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <XCircle size={20} />
          </button>
        )}
      </div>
      <div
        style={{
          border: "2px solid white",
          padding: "1rem",
          height: "70vh",
          overflowY: "auto",
          borderRadius: "8px",
        }}
      >
        <ListGroup>
          {filteredNotes && filteredNotes.length > 0 ? (
            filteredNotes.map((note) => {
              return (
                note && (
                  <NoteChip
                    key={note._id}
                    id={note._id}
                    viewAction={viewAction}
                    editAction={editAction}
                    deleteAction={deleteAction}
                    title={note.title}
                    date={note.createdAt}
                  />
                )
              );
            })
          ) : searchQuery ? (
            <NoteChip
              title="No Notes Found"
              date={format(new Date(), "mm/dd/yyyy").toString()}
            />
          ) : (
            <NoteChip
              title="No Notes Available"
              date={format(new Date(), "mm/dd/yyyy").toString()}
            />
          )}
        </ListGroup>
      </div>
    </div>
  );
};

export default NoteBlock;
