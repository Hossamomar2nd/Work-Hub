import mongoose from "mongoose";
import client_model from "../../../DB/models/client_model.js";
import community from "../../../DB/models/community_model.js";
import freelancer_model from "../../../DB/models/freelancer_model.js";

const safeUserProjection = "-password -token -__v";
const sensitiveResponseKeys = new Set(["password", "token", "__v"]);
const userModelsByRole = {
  client: client_model,
  freelancer: freelancer_model,
};
const membershipFieldsByRole = {
  client: "clientMembers",
  freelancer: "freelancerMembers",
};
const communityEditableFields = ["communityName", "communityDesc"];

const pickAllowedFields = (source = {}, allowedFields) => {
  return allowedFields.reduce((data, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      data[field] = source[field];
    }

    return data;
  }, {});
};

const sanitizeResponseValue = (value) => {
  if (!value || typeof value !== "object") return value;
  if (value instanceof Date) return value;
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (Buffer.isBuffer(value)) return value;

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeResponseValue(item));
  }

  const safeValue = value.toObject ? value.toObject() : { ...value };

  for (const key of Object.keys(safeValue)) {
    if (sensitiveResponseKeys.has(key)) {
      delete safeValue[key];
      continue;
    }

    safeValue[key] = sanitizeResponseValue(safeValue[key]);
  }

  return safeValue;
};

const buildUploadUrl = (filename, req) => {
  if (!filename || typeof filename !== "string") return filename;
  if (/^https?:\/\//i.test(filename)) return filename;

  const normalizedFile = filename
    .replace(/^\/+uploads\/+/i, "")
    .replace(/^uploads\/+/i, "");

  return `${req.protocol}://${req.get("host")}/uploads/${normalizedFile}`;
};

const buildUserResponse = (user, req) => {
  const safeUser = sanitizeResponseValue(user);

  if (!safeUser || typeof safeUser !== "object") return safeUser;

  if (safeUser.image_url) {
    safeUser.image_url = buildUploadUrl(safeUser.image_url, req);
  }

  if (safeUser.coverImage_url) {
    safeUser.coverImage_url = buildUploadUrl(safeUser.coverImage_url, req);
  }

  return safeUser;
};

const toIdString = (value) => {
  if (!value) return "";

  return value.toString();
};

const getMembershipFieldByRole = (role) => membershipFieldsByRole[role] || null;
const getUserModelByRole = (role) => userModelsByRole[role] || null;

const populateSafeCommunityUsers = (query) => {
  return query
    .populate({ path: "freelancerMembers", select: safeUserProjection })
    .populate({ path: "clientMembers", select: safeUserProjection });
};

// Get All Communities
export const getAllCommunities = async (req, res) => {
  let allCommunities = await populateSafeCommunityUsers(
    community.find(),
  ).populate("communityPosts");

  allCommunities = allCommunities.map((item) => sanitizeResponseValue(item));

  return res.status(200).json({ allCommunities });
};

// Get Joined Communities
export const getJoinedCommunities = async (req, res) => {
  const userId = req.params.id;
  const role = req.params.role;

  if (role !== "client" && role !== "freelancer") {
    return res.status(404).json({ msg: "Invalid role!" });
  }

  const memberField = getMembershipFieldByRole(role);
  const allCommunities = await community.find();
  const communitiesData = allCommunities
    .filter((item) => {
      const members = Array.isArray(item[memberField]) ? item[memberField] : [];

      return members.some((id) => toIdString(id) === userId);
    })
    .map((item) => sanitizeResponseValue(item));

  if (communitiesData.length == 0) {
    return res.status(404).json({ msg: "No Communities Found!" });
  }

  return res.status(200).json({ communitiesData });
};

// Get All Member Joined in Communities
export const getAllJoinedMembersCommunities = async (req, res) => {
  const allCommunities = await populateSafeCommunityUsers(community.find());
  const allMembers = new Map();

  allCommunities.forEach((item) => {
    if (Array.isArray(item.freelancerMembers)) {
      item.freelancerMembers.forEach((member) => {
        if (member?._id) {
          allMembers.set(toIdString(member._id), member);
        }
      });
    }

    if (Array.isArray(item.clientMembers)) {
      item.clientMembers.forEach((member) => {
        if (member?._id) {
          allMembers.set(toIdString(member._id), member);
        }
      });
    }
  });

  const modifiedMembers = Array.from(allMembers.values()).map((member) =>
    buildUserResponse(member, req),
  );

  if (!modifiedMembers[0]) {
    return res.status(404).json({ msg: "No Members Found!" });
  }

  return res.status(200).json({ modifiedMembers });
};

// Add Community
export const addCommunity = async (req, res) => {
  const communityData = pickAllowedFields(req.body, communityEditableFields);
  const data = await community.find({
    communityName: communityData.communityName,
  });

  if (data.length === 0) {
    const newCommunity = new community(communityData);

    await newCommunity.save();
    return res
      .status(200)
      .json({ msg: "Community has been created successfuly." });
  }

  return res.status(400).json({ msg: "Community is already exists!" });
};

// Unjoin Community
export const unjoinCommunity = async (req, res) => {
  const communityId = req.params.communityId;
  const userId = req.user._id;
  const memberField = getMembershipFieldByRole(req.user.role);

  if (!memberField) {
    return res.status(403).json({ msg: "You are not authorized" });
  }

  const result = await community.updateOne(
    { _id: communityId },
    { $pull: { [memberField]: userId } },
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ msg: "Community Not Found!" });
  }

  if (result.modifiedCount === 0) {
    return res
      .status(400)
      .json({ msg: "You Are Not Joined In This Community!" });
  }

  return res.status(200).json({ msg: "Unjoined Community Successfuly." });
};

// Join Community
export const joinCommunity = async (req, res) => {
  const communityId = req.params.communityId;
  const userId = req.user._id;
  const memberField = getMembershipFieldByRole(req.user.role);

  if (!memberField) {
    return res.status(403).json({ msg: "You are not authorized" });
  }

  const result = await community.updateOne(
    { _id: communityId },
    { $addToSet: { [memberField]: userId } },
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ msg: "Community Not Found" });
  }

  if (result.modifiedCount === 0) {
    return res
      .status(200)
      .json({ msg: "You Have Already Joined The Community!" });
  }

  return res.status(200).json({ msg: "Joined Community Successfuly." });
};

// Update Community
export const updateCommunity = async (req, res) => {
  const communityId = req.params.id;
  const communityData = pickAllowedFields(req.body, communityEditableFields);
  const updatedCommunity = await community.findByIdAndUpdate(
    communityId,
    { $set: communityData },
    { new: true, runValidators: true },
  );

  if (updatedCommunity) {
    return res.status(200).json({
      msg: "Community has been updated successfuly.",
      community: sanitizeResponseValue(updatedCommunity),
    });
  }

  return res
    .status(404)
    .json({ msg: "There is no community with such id to update." });
};

// Delete Community
export const deleteCommunity = async (req, res) => {
  const communityId = req.params.id;
  const communityToDelete = await community.findById(communityId);

  if (communityToDelete) {
    const filter = { _id: communityId };

    await community.deleteOne(filter);
    return res
      .status(200)
      .json({ msg: "Community has been deleted successfuly." });
  }

  return res.status(400).json({ msg: "Community deletion failed." });
};

export const uploadCoverImage = async (req, res) => {
  if (!req.file) {
    return res
      .status(404)
      .send({ success: false, message: "Cover image is required" });
  }

  const UserModel = getUserModelByRole(req.user.role);

  if (!UserModel) {
    return res.status(403).json({ msg: "You are not authorized" });
  }

  const cover_url = req.file.filename;
  const userData = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage_url: cover_url } },
    { new: true },
  ).select(safeUserProjection);

  if (!userData) {
    return res.status(404).send({ success: false, message: "User not found" });
  }

  const data = buildUserResponse(userData, req);

  return res
    .status(200)
    .json({ msg: "Cover image uploaded successfuly", data });
};
