import { NoteChipProps } from "@/types";
import { truncate } from "@/utils";
import React from "react";
import { Card } from "react-bootstrap";
import { PencilFill, TrashFill, ViewStacked } from "react-bootstrap-icons";

export default function NoteChip({
  id,
  title,
  date,
  deleteAction,
  editAction,
  viewAction,
}: NoteChipProps) {
  return (
    <div
      className="bg-gray-800 p-2"
      style={{ color: "white", borderRadius: "8px", marginTop: "1rem" }}
    >
      <Card.Header
        style={{
          display: "flex",
          flexDirection: "row",
          paddingBottom: "0.3rem",
          justifyContent: "right",
        }}
      >
        <TrashFill
          color="red"
          size={12}
          onClick={() => deleteAction && deleteAction(id!)}
        />
        <PencilFill
          color="white"
          size={12}
          style={{ marginLeft: "1rem" }}
          onClick={() => editAction && editAction(id!)}
        />
      </Card.Header>
      <Card.Body onClick={() => viewAction && viewAction(id!)}>
        <Card.Title
          style={{ fontSize: 12, width: "9rem", marginBottom: "0.4rem" }}
        >
          {truncate(title, 20)}
        </Card.Title>
        <Card.Subtitle style={{ fontSize: 8 }}>{date}</Card.Subtitle>
      </Card.Body>
    </div>
  );
}
