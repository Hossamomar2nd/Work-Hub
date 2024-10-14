
import express from "express";
import auth from '../../middleware/auth.middleware.js';
import { addPost, getPost, getAllPosts, addLike, updatePost, addComment, uploadPostMedia, removeLike, getUserPosts, getCommunityPosts, deletePost, deleteComment, getPostlikesCount } from './post_controller.js'
import endPoints from "../../middleware/endPoints.js";
import { postSchema } from "./post.schema.js";
import { validation } from "../../middleware/val.middleware.js";
import { upload } from "../../middleware/uploadImages.js";

const router = express.Router();

router.get('/getAllPosts', getAllPosts); // auth(endPoints.admin)
router.get('/getUserPosts/:id', getUserPosts); // auth(endPoints.admin)
router.get('/getCommunityPosts/:id', getCommunityPosts); // auth(endPoints.admin)
router.get('/getPostlikesCount/:id', getPostlikesCount); // auth(endPoints.admin)
router.post('/addPost', validation(postSchema), addPost); // auth(endPoints.allUsersExceptAdmin)
router.put('/uploadPostMedia/:id', upload.single('media'), uploadPostMedia); // auth(endPoints.allUsersExceptAdmin)
router.put('/addLike/:postId/:userId/:role', addLike); // auth(endPoints.allUsersExceptAdmin)
router.put('/removeLike/:postId/:userId/:role', removeLike); // auth(endPoints.allUsersExceptAdmin)
router.put('/deleteComment/:postId/:commentText', deleteComment); // auth(endPoints.allUsersExceptAdmin)
router.put('/addComment/:postId/:userId/:role', addComment); // auth(endPoints.allUsersExceptAdmin)
router.put('/updatePost/:id', updatePost); // auth(endPoints.allUsersExceptAdmin)
router.delete('/deletePost/:id', deletePost); // auth(endPoints.allUsersExceptAdmin)

export default router;