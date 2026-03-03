"use client";

import React from "react";
import { Trash, CheckCircle, PlayCircle, Eject } from "react-bootstrap-icons";
import { PostItProps } from "@/types";
import "./PostIt.scss";
import { format } from "date-fns";

const PostIt: React.FC<PostItProps> = ({
  _id,
  title,
  description,
  priority = 0,
  completed = false,
  inProgress = false,
  bgColor = "#fef08a",
  foldColor = "#d4a517",
  createdAt,
  tags,
  onDelete,
  onComplete,
  onDoubleClick,
  onMarkInProgress,
}) => {
  const priorityLabel =
    priority === 2 ? "Top Priority" : priority === 1 ? "Important" : "Standard";

  // Support both hex colors and class names for backwards compatibility
  const isClassName = typeof bgColor === "string" && bgColor.startsWith("postit-");
  
  const containerStyle = !isClassName 
    ? { 
        "--postit-bg": bgColor,
        "--postit-fold": foldColor,
      } as React.CSSProperties
    : {};

  const createdAtLabel = createdAt
    ? format(new Date(createdAt), "MM/dd/yyyy")
    : "";

  const handleProgressBtn = () => {
    if(onMarkInProgress && inProgress) {
      return (<button
              className={`postit-button postit-button-in-progress ${inProgress ? "active" : ""}`}
              onClick={() => onMarkInProgress(_id)}
              title={inProgress ? "Mark as not in progress" : "Mark as in progress"}
              aria-label="Mark as in progress"
            >
              <Eject size={20} />
            </button>)
    } else if(onMarkInProgress && !inProgress){
      return (<button
              className={`postit-button postit-button-in-progress ${inProgress ? "active" : ""}`}
              onClick={() => onMarkInProgress(_id)}
              title={inProgress ? "Mark as not in progress" : "Mark as in progress"}
              aria-label="Mark as in progress"
            >
              <PlayCircle size={20} />
            </button>)
    } else {
      return;
    }
  }

  return (
    <div 
      className={`postit-container ${isClassName ? bgColor : ""} ${completed ? "completed" : ""}`}
      style={containerStyle}
      onDoubleClick={(e) => {
        e.preventDefault();
        onDoubleClick(_id);
      }}
    >
      {/* Folded corner effect */}
      <div className="postit-fold"></div>

      {/* Header bar */}
      <div className="postit-header">
        <span className={`postit-date ${priority === 2 ? 'priority-txt' : 'standard-txt'}`} aria-label="Created at">
          {createdAtLabel}
        </span>
        <div className="postit-header-actions">
          {onMarkInProgress && handleProgressBtn()}
          <button
            className="postit-button postit-button-complete"
            onClick={() => onComplete(_id)}
            title={completed ? "Mark as incomplete" : "Mark as complete"}
            aria-label="Complete postIt"
          >
            <CheckCircle size={20} />
          </button>
          <button
            className={`postit-button ${priority === 2 ? 'postit-button-delete-top' : 'postit-button-delete'}`}
            onClick={() => onDelete(_id)}
            title="Delete postIt"
            aria-label="Delete postIt"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="postit-content">
        <div className="postit-title-row">
          <h3 className={`postit-title ${priority === 2 ? 'priority-txt' : 'standard-txt'}`}>{title}</h3>
          <span className={`postit-priority postit-priority-${priority}`}>
            {priorityLabel}
          </span>
        </div>
        <p className={`postit-description ${priority === 2 ? 'priority-txt' : 'standard-txt'}`}>{description}</p>
      </div>
      {/* Tags */}
      <div className="postit-tags">
        {tags && tags.map((tag, index) => (<div className="pills" key={index}>{tag}</div>))}
      </div>  
    </div>
  );
};

export default PostIt;
