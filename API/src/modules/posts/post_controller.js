
import mongoose from "mongoose";
import client_model from "../../../DB/models/client_model.js";
import freelancer_model from "../../../DB/models/freelancer_model.js";
import Postmodel from "../../../DB/models/post_model.js";
import fs from "fs";

// Get All Posts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Postmodel.find();
        const modifiedPosts = [];

        if (!posts[0]) {
            return res.status(404).json({ message: 'No posts found' });
        }

        for (const post of posts) {
            let modifiedPost = { ...post._doc };
            let data;

            if (modifiedPost.posterType === "freelancer") {
                data = await freelancer_model.findById(modifiedPost.posterId);
            } else if (modifiedPost.posterType === "client") {
                data = await client_model.findById(modifiedPost.posterId);
            } else {
                return res.status(404).json({ message: 'Invalid role' });
            }

            modifiedPost.posterId = { ...data._doc };
            modifiedPost.posterId.image_url = "http://" + req.hostname + ":3000/" + modifiedPost.posterId.image_url;
            modifiedPost.media_url = "http://" + req.hostname + ":3000/" + modifiedPost.media_url;

            const commentsData = [];

            const postComments = modifiedPost.comments;

            for (let index = 0; index < postComments.length; index++) {
                const userId = postComments[index]._id;

                let data;
                data = await freelancer_model.findById(userId);

                if(!data) {
                    data = await client_model.findById(userId);
                }

                postComments[index].activityStatus = data.activityStatus;

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
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get User Posts
export const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.id;

        let userData = await freelancer_model.findById(userId);

        if(!userData) {
            userData = await client_model.findById(userId);
        }

        const posts = await Postmodel.find({posterId: userId, posterType: userData.role}).populate("communityId");
        const modifiedPosts = [];

        for (const post of posts) {
            let modifiedPost = { ...post._doc };
            let data;

            if (modifiedPost.posterType === "freelancer") {
                data = userData;
            } else if (modifiedPost.posterType === "client") {
                data = userData;
            } else {
                return res.status(404).json({ message: 'Invalid role' });
            }

            modifiedPost.posterId = { ...data._doc };
            modifiedPost.posterId.image_url = "http://" + req.hostname + ":3000/" + modifiedPost.posterId.image_url;
            modifiedPost.media_url = "http://" + req.hostname + ":3000/" + modifiedPost.media_url;
            modifiedPosts.push(modifiedPost);
        }

        if (modifiedPosts.length > 0) {
            return res.status(200).json({ posts: modifiedPosts });
        } else {
            return res.status(404).json({ message: 'No posts found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Community Posts
export const getCommunityPosts = async (req, res) => {
    try {
        const communityId = req.params.id;
        
        const posts = await Postmodel.find({communityId: communityId}).populate("communityId");
        const modifiedPosts = [];

        for (const post of posts) {
            let modifiedPost = { ...post._doc };
            let data;

            if (modifiedPost.posterType === "freelancer") {
                data = await freelancer_model.findById(modifiedPost.posterId);
            } else if (modifiedPost.posterType === "client") {
                data = await client_model.findById(modifiedPost.posterId);;
            } else {
                return res.status(404).json({ message: 'Invalid role' });
            }

            modifiedPost.posterId = { ...data._doc };
            modifiedPost.posterId.image_url = "http://" + req.hostname + ":3000/" + modifiedPost.posterId.image_url;
            modifiedPost.media_url = "http://" + req.hostname + ":3000/" + modifiedPost.media_url;
            modifiedPosts.push(modifiedPost);
        }

        if (modifiedPosts.length > 0) {
            return res.status(200).json({ posts: modifiedPosts });
        } else {
            return res.status(404).json({ message: 'No posts found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Add Post
export const addPost = async (req, res) => {
    try {
        const { communityId, posterId, posterType, caption } = req.body

        const date = new Date();
        const creationDate = date.getTime();

        const newpost = new Postmodel({
            communityId,
            posterId,
            posterType,
            caption,
            creationDate
        });

        const savePost = await newpost.save();

        res.json({ message: 'Post created successfully', savePost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Upload Media
export const uploadPostMedia = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(404).send({ success: false, message: "media is required" });
        }

        const id = req.params.id;

        if (id == undefined) {
            return res.status(404).send({ success: false, message: "id is required" });
        }

        const media_url = req.file.filename;

        const filter = { _id: id };
        const update = { $set: { media_url: media_url } };

        const process =  await Postmodel.updateOne(filter, update);

        if(process) {
            res.json({ message: 'Media uploaded successfully' });
        }
        else {
            res.status(404).json({ message: 'Somthing Went Wrong!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Post By ID
export const getPost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Postmodel.findById({ _id: id })
            .populate('createdByClient', 'email username clientImage_url') // Populate the createdByClient field with email
            .populate('createdByFreelancer', 'email username freelancerImage_url'); // Populate the createdByFreelancer field with email

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json({ message: 'Post found', post });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });

    }


};

// Get Post Likes Count By Post ID
export const getPostlikesCount = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Postmodel.findById({ _id: id })

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const likesCount = post.likes.length;

        res.status(200).json({ message: 'Post found', likesCount });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add Like To Post
export const addLike = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;
        const role = req.params.role;

        let userData;

        if(role == "freelancer") {
            userData = await freelancer_model.findById(userId);
            if(!userData) {
                return res.status(404).json({ msg: "Freelancer Not Found" });
            }
        }

        if(role == "client") {
            userData = await client_model.findById(userId);
            if(!userData) {
                return res.status(404).json({ msg: "Client Not Found" });
            }
        }

        const postToUpdate = await Postmodel.findById(postId);

        if (postToUpdate) {
            let likes = postToUpdate.likes;

            likes.push(userId);

            const filter = { _id: postId };
            const update = { $set: { likes: likes } };

            await Postmodel.updateOne(filter, update);

            return res.status(200).json({ msg: "post like added successfuly." });
        }

        res.status(400).json({ msg: "There is no post with such id to update." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove Like From Post
export const removeLike = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;
        const role = req.params.role;

        let userData;

        if(role == "freelancer") {
            userData = await freelancer_model.findById(userId);
            if(!userData) {
                return res.status(404).json({ msg: "Freelancer Not Found" });
            }
        }

        if(role == "client") {
            userData = await client_model.findById(userId);
            if(!userData) {
                return res.status(404).json({ msg: "Client Not Found" });
            }
        }

        const postToUpdate = await Postmodel.findById(postId);

        if (postToUpdate) {
            let likes = postToUpdate.likes;

            let newLikes = [];

            likes.filter((id) => {
                // console.log(id);
                // console.log(userData._id);
                if(id.valueOf() !== userData._id.valueOf()) {
                    newLikes.push(id);
                }
            });

            // console.log(newLikes);

            const filter = { _id: postId };
            const update = { $set: { likes: newLikes } };

            await Postmodel.updateOne(filter, update);

            return res.status(200).json({ msg: "post like removed successfuly." });
        }

        res.status(404).json({ msg: "Post Not Found" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Add Comment to Post
export const addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.params.userId;
        const role = req.params.role;
        const comment = req.body.comment;

        let userData;

        if(role == "freelancer") {
            userData = await freelancer_model.findById(userId);
            if(!userData) {
                return res.status(404).json({ msg: "Freelancer Not Found" });
            }
        }

        if(role == "client") {
            userData = await client_model.findById(userId);
            if(!userData) {
                return res.status(404).json({ msg: "Client Not Found" });
            }
        }

        const postToUpdate = await Postmodel.findById(postId);

        if (postToUpdate) {
            const date = new Date();
            const commentCreationDate = date.getTime();

            const allComments = postToUpdate.comments;

            const modifiedUser = { ...userData._doc }; // Create a copy of the service object
            modifiedUser.image_url = "http://" + req.hostname + ":3000/" + modifiedUser.image_url;
            modifiedUser.comment = comment;
            modifiedUser.commentDate = commentCreationDate;

            allComments.push(modifiedUser);
            
            const filter = { _id: postId };
            const update = { $set: { comments: allComments } };

            await Postmodel.updateOne(filter, update);

            return res.status(200).json({ msg: "post comment added successfuly." , allComments});
        }

        res.status(404).json({ msg: "Post Not Found!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Post
export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentText = req.params.commentText;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: 'Invalid Post ID' });
        }

        const postData = await Postmodel.findById(postId);

        const commentsData = postData.comments;

        let newCommentsData = [];

        commentsData.filter((userComment) => {
            console.log(userComment.comment);
            console.log(commentText);
            if(userComment.comment !== commentText) {
                newCommentsData.push(userComment);
            }
        });

        const filter = { _id: postId };
        const update = { $set: { comments: newCommentsData } };

        await Postmodel.updateOne(filter, update);

        return res.status(200).json({ msg: "Comment Deleted Successfuly.", newCommentsData });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update Post
export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const postToUpdate = await Postmodel.findById(communityId);

        if (postToUpdate) {
            const filter = { _id: postId };
            const update = { $set: { ...req.body } };
            await Postmodel.updateOne(filter, update);
            return res.status(200).json({ msg: "past has been updated successfuly." });
        }

        res.status(400).json({ msg: "There is no post with such id to update." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Somthing went wrong!" });
    }
}

// Delete Post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }

        const data = await Postmodel.findById(id);

        if (!data) {
            return res.status(404).json({ message: 'Post Not Found' });
        }

        const filter = { _id: id }
        const process = await Postmodel.deleteOne(filter);

        if (process) {
            fs.unlinkSync("./src/middleware/upload/" + data.media_url); //delete old image

            return res.status(200).json({ msg: "Post deleted successfully" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
