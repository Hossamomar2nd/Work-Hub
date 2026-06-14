import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    _id: {
      type: mongoose.Types.ObjectId,
    },
    userId: {
      type: mongoose.Types.ObjectId,
    },
    userRole: {
      type: String,
    },
    comment: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  {
    _id: false,
    id: false,
  },
);

const postSchema = new Schema(
  {
    communityId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "community",
    },
    posterId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    posterType: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    media_url: {
      type: String,
      required: false,
    },
    likes: {
      type: [mongoose.Types.ObjectId],
      required: false,
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    creationDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("post", postSchema);