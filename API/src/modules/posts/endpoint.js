import endPoints from "../../middleware/endPoints.js";

const userWriteRoles = endPoints.allUsersExceptAdmin;

const postEndPoints = {
  createPost: userWriteRoles,
  updatePost: userWriteRoles,
  deletePost: userWriteRoles,
  uploadMedia: userWriteRoles,
  addLike: userWriteRoles,
  removeLike: userWriteRoles,
  addComment: userWriteRoles,
  deleteComment: userWriteRoles,
};

export default postEndPoints;
