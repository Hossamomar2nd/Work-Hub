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
    const posts = await Postmodel.find();
    const modifiedPosts = [];

    if (!posts[0]) {
      return res.status(404).json({ message: "No posts found" });
    }

    for (const post of posts) {
      let modifiedPost = { ...post._doc };
      let data;

      if (modifiedPost.posterType === "freelancer") {
        data = await freelancer_model.findById(modifiedPost.posterId);
      } else if (modifiedPost.posterType === "client") {
        data = await client_model.findById(modifiedPost.posterId);
      } else {
        return res.status(404).json({ message: "Invalid role" });
      }

      modifiedPost.posterId = { ...data._doc };
      modifiedPost.posterId.image_url =
        "http://" +
        req.hostname +
        ":3000/uploads/" +
        modifiedPost.posterId.image_url;
      modifiedPost.media_url =
        "http://" + req.hostname + ":3000/uploads/" + modifiedPost.media_url;

      const commentsData = [];

      const postComments = modifiedPost.comments;

      for (let index = 0; index < postComments.length; index++) {
        const userId = postComments[index].userId || postComments[index]._id;

        let data;
        data = await freelancer_model.findById(userId);

        if (!data) {
          data = await client_model.findById(userId);
        }

        if (data) {
          postComments[index].activityStatus = data.activityStatus;
        }

        commentsData.push(postComments[index]);
      }

      modifiedPost.comments = commentsData;

      console.log(modifiedPost._id);

      const filter = { _id: modifiedPost._id };
      const update = { $set: { comments: commentsData } };

      await Postmodel.updateOne(filter, update);

      modifiedPosts.push(modifiedPost);
    }

    return res.status(200).json({ posts: modifiedPosts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get User Posts
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    let userData = await freelancer_model.findById(userId);

    if (!userData) {
      userData = await client_model.findById(userId);
    }

    const posts = await Postmodel.find({
      posterId: userId,
      posterType: userData.role,
    }).populate("communityId");
    const modifiedPosts = [];

    for (const post of posts) {
      let modifiedPost = { ...post._doc };
      let data;

      if (modifiedPost.posterType === "freelancer") {
        data = userData;
      } else if (modifiedPost.posterType === "client") {
        data = userData;
      } else {
        return res.status(404).json({ message: "Invalid role" });
      }

      modifiedPost.posterId = { ...data._doc };
      modifiedPost.posterId.image_url =
        "http://" +
        req.hostname +
        ":3000/uploads/" +
        modifiedPost.posterId.image_url;
      modifiedPost.media_url =
        "http://" + req.hostname + ":3000/uploads/" + modifiedPost.media_url;
      modifiedPosts.push(modifiedPost);
    }

    if (modifiedPosts.length > 0) {
      return res.status(200).json({ posts: modifiedPosts });
    } else {
      return res.status(404).json({ message: "No posts found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Community Posts
export const getCommunityPosts = async (req, res) => {
  try {
    const communityId = req.params.id;

    const posts = await Postmodel.find({ communityId: communityId }).populate(
      "communityId",
    );
    const modifiedPosts = [];

    for (const post of posts) {
      let modifiedPost = { ...post._doc };
      let data;

      if (modifiedPost.posterType === "freelancer") {
        data = await freelancer_model.findById(modifiedPost.posterId);
      } else if (modifiedPost.posterType === "client") {
        data = await client_model.findById(modifiedPost.posterId);
      } else {
        return res.status(404).json({ message: "Invalid role" });
      }

      modifiedPost.posterId = { ...data._doc };
      modifiedPost.posterId.image_url =
        "http://" +
        req.hostname +
        ":3000/uploads/" +
        modifiedPost.posterId.image_url;
      modifiedPost.media_url =
        "http://" + req.hostname + ":3000/uploads/" + modifiedPost.media_url;
      modifiedPosts.push(modifiedPost);
    }

    if (modifiedPosts.length > 0) {
      return res.status(200).json({ posts: modifiedPosts });
    } else {
      return res.status(404).json({ message: "No posts found" });
    }
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
    const post = await Postmodel.findById({ _id: id })
      .populate("createdByClient", "email username clientImage_url") // Populate the createdByClient field with email
      .populate("createdByFreelancer", "email username freelancerImage_url"); // Populate the createdByFreelancer field with email

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post found", post });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Post Likes Count By Post ID
export const getPostlikesCount = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Postmodel.findById({ _id: id });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likesCount = post.likes.length;

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
