import { PostItNote } from "@/types";

const sortCompletedPostIts = (postIts: PostItNote[]) => {
    return postIts.filter((postIt: PostItNote) => postIt.completed === true);
}

export {
    sortCompletedPostIts
}