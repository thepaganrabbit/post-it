import { PostIt } from "./postit/schemas/postit.schema";

export interface PostitCounts {
  total: number;
  todos: number;
  inProgress: number;
  completed: number;
}

export interface ResponsePayload {
  backlog: PostIt[];
  inProgress: PostIt[];
  completed: PostIt[];
}