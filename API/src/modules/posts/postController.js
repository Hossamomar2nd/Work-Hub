import mongoose from "mongoose";
import client_model from "../../../DB/models/client_model.js";
import freelancer_model from "../../../DB/models/freelancer_model.js";
import Postmodel from "../../../DB/models/post_model.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../../uploads");
const updatePostAllowedFields = ["caption"];
const userModelsByRole = {
  client: client_model,
  freelancer: freelancer_model,
};
const safeUserProjection = "-password -token -__v";

const toIdString = (value) => {
  if (!value) return "";

  return value.toString();
};

const isPostOwner = (post, user) => {
  return (
    Boolean(post) &&
    Boolean(user) &&
    toIdString(post.posterId) === toIdString(user._id) &&
    post.posterType === user.role
  );
};

const isCommentAuthor = (comment, user) => {
  return (
    Boolean(comment) &&
    Boolean(user) &&
    Boolean(comment.userId) &&
    toIdString(comment.userId) === toIdString(user._id)
  );
};

const sanitizeComment = (comment) => {
  if (!comment || typeof comment !== "object") return comment;

  const safeComment = { ...comment };
  delete safeComment.password;
  delete safeComment.token;
  delete safeComment.__v;

  return safeComment;
};

const sanitizeUser = (user) => {
  if (!user || typeof user !== "object") return user;

  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser.token;
  delete safeUser.__v;

  return safeUser;
};

const buildUploadUrl = (filename, req) => {
  if (!filename || typeof filename !== "string") return filename;
  if (/^https?:\/\//i.test(filename)) return filename;

  const normalizedFile = filename
    .replace(/^\/+uploads\/+/i, "")
    .replace(/^uploads\/+/i, "");
  const normalizedPath = `/uploads/${normalizedFile}`;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return `${baseUrl}${normalizedPath}`;
};

const buildUserResponse = (user, req) => {
  const safeUser = sanitizeUser(user);

  if (!safeUser || typeof safeUser !== "object") return safeUser;

  if (safeUser.image_url) {
    safeUser.image_url = buildUploadUrl(safeUser.image_url, req);
  }

  if (safeUser.coverImage_url) {
    safeUser.coverImage_url = buildUploadUrl(safeUser.coverImage_url, req);
  }

  return safeUser;
};

const getUserModelByRole = (role) => userModelsByRole[role] || null;

const findUserByRole = async (id, role) => {
  const UserModel = getUserModelByRole(role);

  if (!UserModel) return null;

  return UserModel.findById(id).select(safeUserProjection).lean();
};

const findUserByAnyPostRole = async (id) => {
  const freelancer = await findUserByRole(id, "freelancer");
  if (freelancer) return freelancer;

  return findUserByRole(id, "client");
};

const enrichCommentForRead = async (comment) => {
  const safeComment = sanitizeComment(comment);

  if (!safeComment || typeof safeComment !== "object") return safeComment;

  const userId = safeComment.userId || safeComment._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) return safeComment;

  const user = await findUserByAnyPostRole(userId);

  if (user) {
    safeComment.activityStatus = user.activityStatus;
  }

  return safeComment;
};

const buildPostResponse = async (post, req, { includeComments = false } = {}) => {
  const modifiedPost = { ...post };

  if (modifiedPost.media_url) {
    modifiedPost.media_url = buildUploadUrl(modifiedPost.media_url, req);
  }

  const UserModel = getUserModelByRole(modifiedPost.posterType);

  if (!UserModel) {
    return { error: { status: 404, message: "Invalid role" } };
  }

  const poster = await UserModel.findById(modifiedPost.posterId)
    .select(safeUserProjection)
    .lean();

  modifiedPost.posterId = buildUserResponse(poster, req);

  if (includeComments) {
    const comments = Array.isArray(modifiedPost.comments)
      ? modifiedPost.comments
      : [];

    modifiedPost.comments = await Promise.all(
      comments.map((comment) => enrichCommentForRead(comment)),
    );
  }

  return { post: modifiedPost };
};

const buildPostListResponse = async (
  posts,
  req,
  { includeComments = false } = {},
) => {
  const modifiedPosts = [];

  for (const post of posts) {
    const result = await buildPostResponse(post, req, { includeComments });

    if (result.error) {
      return result;
    }

    modifiedPosts.push(result.post);
  }

  return { posts: modifiedPosts };
};

const getUploadPath = (fileName) => {
  if (!fileName || typeof fileName !== "string") return null;

  const uploadRoot = path.resolve(uploadsDir);
  const uploadPath = path.resolve(uploadRoot, fileName);

  if (!uploadPath.startsWith(uploadRoot + path.sep)) return null;

  return uploadPath;
};

const deleteUploadedFile = async (fileName) => {
  const uploadPath = getUploadPath(fileName);

  if (!uploadPath) return;

  try {
    await fs.unlink(uploadPath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

const cleanupUploadedRequestFile = async (req) => {
  if (!req.file?.filename) return;

  try {
    await deleteUploadedFile(req.file.filename);
  } catch (error) {
    console.error(error);
  }
};

const buildPostUpdateData = (body) => {
  const updateData = {};

  for (const field of updatePostAllowedFields) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) continue;

    const value = body[field];
    updateData[field] = typeof value === "string" ? value.trim() : value;
  }

  return updateData;
};

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Postmodel.find().lean();
    const result = await buildPostListResponse(posts, req, {
      includeComments: true,
    });

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    }

    return res.status(200).json({ posts: result.posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get User Posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const userData = await findUserByAnyPostRole(userId);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Postmodel.find({
      posterId: userId,
      posterType: userData.role,
    })
      .populate("communityId")
      .lean();
    const result = await buildPostListResponse(posts, req);

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    }

    return res.status(200).json({ posts: result.posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Community Posts
export const getCommunityPosts = async (req, res) => {
  try {
    const communityId = req.params.id;

    const posts = await Postmodel.find({ communityId })
      .populate("communityId")
      .lean();
    const result = await buildPostListResponse(posts, req);

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    }

    return res.status(200).json({ posts: result.posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Add Post
export const addPost = async (req, res) => {
  try {
    const { communityId, caption } = req.body;
    const posterId = req.user._id;
    const posterType = req.user.role;

    const date = new Date();
    const creationDate = date.getTime();

    const newpost = new Postmodel({
      communityId,
      posterId,
      posterType,
      caption,
      creationDate,
    });

    const savePost = await newpost.save();

    res.json({ message: "Post created successfully", savePost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Upload Media
export const uploadPostMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(404)
        .send({ success: false, message: "media is required" });
    }

    const id = req.params.id;

    if (id == undefined) {
      await cleanupUploadedRequestFile(req);
      return res
        .status(404)
        .send({ success: false, message: "id is required" });
    }

    const media_url = req.file.filename;
    const post = await Postmodel.findById(id);

    if (!post) {
      await cleanupUploadedRequestFile(req);
      return res.status(404).json({ message: "Post not found" });
    }

    if (!isPostOwner(post, req.user)) {
      await cleanupUploadedRequestFile(req);
      return res.status(403).json({ message: "You are not authorized" });
    }

    post.media_url = media_url;
    await post.save();

    return res.json({ message: "Media uploaded successfully" });
  } catch (error) {
    await cleanupUploadedRequestFile(req);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Post By ID
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Postmodel.findById(id).lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const result = await buildPostResponse(post, req, {
      includeComments: true,
    });

    if (result.error) {
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
    }

    res.status(200).json({ message: "Post found", post: result.post });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Post Likes Count By Post ID
export const getPostlikesCount = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Postmodel.findById(id).select("likes").lean();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;

    res.status(200).json({ message: "Post found", likesCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Like To Post
export const addLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const postToUpdate = await Postmodel.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: userId } },
      { new: true, projection: { _id: 1 } },
    );

    if (!postToUpdate) {
      return res.status(404).json({ msg: "Post Not Found" });
    }

    return res.status(200).json({ msg: "post like added successfuly." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove Like From Post
export const removeLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;

    const postToUpdate = await Postmodel.findOneAndUpdate(
      { _id: postId },
      { $pull: { likes: userId } },
      { new: true, projection: { _id: 1 } },
    );

    if (!postToUpdate) {
      return res.status(404).json({ msg: "Post Not Found" });
    }

    return res.status(200).json({ msg: "post like removed successfuly." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add Comment to Post
export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const userRole = req.user.role;
    const comment = req.body.comment.trim();
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      userRole,
      comment,
      createdAt: new Date(),
    };

    const postToUpdate = await Postmodel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment } },
      { new: true, projection: { _id: 1 } },
    );

    if (postToUpdate) {
      return res.status(200).json({
        msg: "post comment added successfuly.",
        comment: newComment,
      });
    }

    res.status(404).json({ msg: "Post Not Found!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid Comment ID" });
    }

    const postData = await Postmodel.findById(postId).lean();

    if (!postData) {
      return res.status(404).json({ msg: "Post Not Found!" });
    }

    const commentsData = Array.isArray(postData.comments)
      ? postData.comments
      : [];
    const commentToDelete = commentsData.find((userComment) => {
      return toIdString(userComment?._id) === toIdString(commentId);
    });

    if (!commentToDelete) {
      return res.status(404).json({ msg: "Comment Not Found!" });
    }

    const canDeleteAsPostOwner = isPostOwner(postData, req.user);
    const canDeleteAsCommentAuthor = isCommentAuthor(commentToDelete, req.user);

    if (!canDeleteAsPostOwner && !canDeleteAsCommentAuthor) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    const newCommentsData = commentsData.filter((userComment) => {
      return toIdString(userComment?._id) !== toIdString(commentId);
    }).map(sanitizeComment);

    await Postmodel.updateOne(
      { _id: postId },
      { $pull: { comments: { _id: commentToDelete._id } } },
    );

    return res
      .status(200)
      .json({ msg: "Comment Deleted Successfuly.", newCommentsData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updateData = buildPostUpdateData(req.body);

    const postToUpdate = await Postmodel.findById(postId);

    if (!postToUpdate) {
      return res.status(404).json({ msg: "Post Not Found" });
    }

    if (!isPostOwner(postToUpdate, req.user)) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ msg: "No allowed post fields were provided." });
    }

    postToUpdate.set(updateData);
    await postToUpdate.save();

    return res.status(200).json({ msg: "post has been updated successfuly." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Somthing went wrong!" });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const data = await Postmodel.findById(id);

    if (!data) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (!isPostOwner(data, req.user)) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    await data.deleteOne();

    try {
      await deleteUploadedFile(data.media_url);
    } catch (error) {
      console.error(error);
    }

    return res.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
