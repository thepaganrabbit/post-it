import { CountBlockProps } from "@/types";
import React from "react";
import { Badge, ListGroup } from "react-bootstrap";

const CountBlock = ({counts}: CountBlockProps) => {
 
  return (
    <ListGroup>
           <ListGroup.Item
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          total
        </div>
        <Badge bg="primary" pill>
          {counts.total}
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          todos
        </div>
        <Badge bg="primary" pill>
          {counts.todos}
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          In Progress
        </div>
        <Badge bg="primary" pill>
          {counts.inProgress}
        </Badge>
      </ListGroup.Item>
      <ListGroup.Item
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          Completed
        </div>
        <Badge bg="primary" pill>
          {counts.completed}
        </Badge>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default CountBlock;
