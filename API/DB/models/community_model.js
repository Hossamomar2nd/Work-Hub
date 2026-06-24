import mongoose from "mongoose";
const { Schema } = mongoose;

const communitySchema = new Schema(
  {
    communityName: {
      type: String,
      required: true,
      trim: true,
    },
    communityDesc: {
      type: String,
      required: true,
      trim: true,
    },
    communityPosts: {
      type: [mongoose.Types.ObjectId],
      required: false,
      ref: "post",
    },
    clientMembers: {
      type: [mongoose.Types.ObjectId],
      required: false,
      ref: "client",
    },
    freelancerMembers: {
      type: [mongoose.Types.ObjectId],
      required: false,
      ref: "freelancer",
    },
  },
  {
    timestamps: true,
  },
);

communitySchema.index({ communityName: 1 });
communitySchema.index({ clientMembers: 1 });
communitySchema.index({ freelancerMembers: 1 });

export default mongoose.model("community", communitySchema);
