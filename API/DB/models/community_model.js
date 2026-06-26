import mongoose from "mongoose";
const { Schema } = mongoose;

const normalizeCommunityName = (value) => {
  if (typeof value !== "string") return value;

  return value.trim().replace(/\s+/g, " ").toLowerCase();
};

const communitySchema = new Schema(
  {
    communityName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    communityNameNormalized: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      select: false,
    },
    communityDesc: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
    coverImage_url: {
      type: String,
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

communitySchema.pre("validate", function setNormalizedCommunityName(next) {
  if (this.isModified("communityName") || !this.communityNameNormalized) {
    this.communityNameNormalized = normalizeCommunityName(this.communityName);
  }

  next();
});

communitySchema.pre("findOneAndUpdate", function setUpdatedNormalizedName(next) {
  const update = this.getUpdate() || {};
  const setData = update.$set || update;

  if (Object.prototype.hasOwnProperty.call(setData, "communityName")) {
    update.$set = {
      ...update.$set,
      communityNameNormalized: normalizeCommunityName(setData.communityName),
    };
    this.setUpdate(update);
  }

  next();
});

communitySchema.index({ communityName: 1 });
communitySchema.index({ communityNameNormalized: 1 }, { unique: true });
communitySchema.index({ clientMembers: 1 });
communitySchema.index({ freelancerMembers: 1 });

export default mongoose.model("community", communitySchema);
