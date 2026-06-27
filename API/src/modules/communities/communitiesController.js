import mongoose from "mongoose";
import community from "../../../DB/models/community_model.js";
import Postmodel from "../../../DB/models/post_model.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../../../uploads");
const sensitiveResponseKeys = new Set([
  "password",
  "token",
  "email",
  "phoneNumber",
  "lastLogin",
  "accessToken",
  "refreshToken",
  "resetToken",
  "verificationToken",
  "auth",
  "session",
  "sessions",
  "__v",
  "communityPosts",
]);
const publicMemberFieldsByRole = {
  client: [
    "_id",
    "name",
    "image_url",
    "coverImage_url",
    "country",
    "activityStatus",
    "role",
    "ordersCount",
  ],
  freelancer: [
    "_id",
    "name",
    "image_url",
    "coverImage_url",
    "country",
    "desc",
    "activityStatus",
    "languages",
    "skills",
    "servicesCount",
    "specialization",
    "role",
  ],
};
const membershipFieldsByRole = {
  client: "clientMembers",
  freelancer: "freelancerMembers",
};
const communityEditableFields = ["communityName", "communityDesc"];
const communityReadProjection = "-communityPosts -communityNameNormalized -__v";
const communityStableSort = { createdAt: -1, _id: -1 };

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
const getPublicMemberSelectByRole = (role) =>
  publicMemberFieldsByRole[role]?.join(" ") || null;

const findCommunitiesForRead = (filter = {}) =>
  community.find(filter).select(communityReadProjection);

const findCommunityForReadById = (id) =>
  community.findById(id).select(communityReadProjection);

const sanitizeCommunityForRead = (communityData) => {
  const safeCommunity = sanitizeResponseValue(communityData);

  if (safeCommunity && typeof safeCommunity === "object") {
    delete safeCommunity.communityPosts;
  }

  return safeCommunity;
};

const populateSafeCommunityUsers = (query) => {
  return query
    .populate({
      path: "freelancerMembers",
      select: getPublicMemberSelectByRole("freelancer"),
    })
    .populate({
      path: "clientMembers",
      select: getPublicMemberSelectByRole("client"),
    });
};

const normalizeCommunityName = (value) => {
  if (typeof value !== "string") return value;

  return value.trim().replace(/\s+/g, " ").toLowerCase();
};

const buildPagination = (query) => {
  const pageValue = Number.parseInt(query.page, 10);
  const limitValue = Number.parseInt(query.limit, 10);
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const requestedLimit =
    Number.isInteger(limitValue) && limitValue > 0 ? limitValue : 20;
  const limit = Math.min(requestedLimit, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPaginationMeta = ({ page, limit, total }) => {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
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

const isDuplicateCommunityNameError = (error) => {
  return (
    error?.code === 11000 &&
    (Object.prototype.hasOwnProperty.call(
      error.keyPattern || {},
      "communityNameNormalized",
    ) ||
      Object.prototype.hasOwnProperty.call(
        error.keyValue || {},
        "communityNameNormalized",
      ))
  );
};

const sendDuplicateCommunityName = (res) => {
  return res.status(409).json({ message: "Community already exists" });
};

export const getAllCommunities = async (req, res) => {
  const pagination = buildPagination(req.query);
  const total = await community.countDocuments();
  let allCommunities = await populateSafeCommunityUsers(
    findCommunitiesForRead()
      .sort(communityStableSort)
      .skip(pagination.skip)
      .limit(pagination.limit),
  );

  allCommunities = allCommunities.map((item) => sanitizeCommunityForRead(item));

  return res.status(200).json({
    allCommunities,
    pagination: buildPaginationMeta({ ...pagination, total }),
  });
};

export const getCommunityById = async (req, res) => {
  const communityId = req.params.id;
  const communityData = await findCommunityForReadById(communityId);

  if (!communityData) {
    return res.status(404).json({ message: "Community Not Found!" });
  }

  const safeCommunity = sanitizeCommunityForRead(communityData);
  safeCommunity.postsCount = await Postmodel.countDocuments({ communityId });

  return res.status(200).json({ community: safeCommunity });
};

export const getJoinedCommunities = async (req, res) => {
  const memberField = getMembershipFieldByRole(req.user.role);

  if (!memberField) {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const pagination = buildPagination(req.query);
  const filter = { [memberField]: req.user._id };
  const total = await community.countDocuments(filter);
  const communitiesData = (
    await findCommunitiesForRead(filter)
      .sort(communityStableSort)
      .skip(pagination.skip)
      .limit(pagination.limit)
  ).map((item) => sanitizeCommunityForRead(item));

  return res.status(200).json({
    communitiesData,
    pagination: buildPaginationMeta({ ...pagination, total }),
  });
};

export const getAllJoinedMembersCommunities = async (req, res) => {
  const pagination = buildPagination(req.query);
  const allCommunities = await populateSafeCommunityUsers(
    findCommunitiesForRead(),
  );
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

  const members = Array.from(allMembers.values());
  const modifiedMembers = members
    .slice(pagination.skip, pagination.skip + pagination.limit)
    .map((member) => buildUserResponse(member, req));

  return res.status(200).json({
    modifiedMembers,
    pagination: buildPaginationMeta({ ...pagination, total: members.length }),
  });
};

export const addCommunity = async (req, res) => {
  const communityData = pickAllowedFields(req.body, communityEditableFields);
  communityData.communityNameNormalized = normalizeCommunityName(
    communityData.communityName,
  );

  try {
    const newCommunity = new community(communityData);

    await newCommunity.save();
    return res
      .status(200)
      .json({ message: "Community has been created successfully." });
  } catch (error) {
    if (isDuplicateCommunityNameError(error)) {
      return sendDuplicateCommunityName(res);
    }

    throw error;
  }
};

export const unjoinCommunity = async (req, res) => {
  const communityId = req.params.communityId;
  const userId = req.user._id;
  const memberField = getMembershipFieldByRole(req.user.role);

  if (!memberField) {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const result = await community.updateOne(
    { _id: communityId },
    { $pull: { [memberField]: userId } },
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Community Not Found!" });
  }

  if (result.modifiedCount === 0) {
    return res
      .status(400)
      .json({ message: "You Are Not Joined In This Community!" });
  }

  return res.status(200).json({ message: "Unjoined Community Successfully." });
};

export const joinCommunity = async (req, res) => {
  const communityId = req.params.communityId;
  const userId = req.user._id;
  const memberField = getMembershipFieldByRole(req.user.role);

  if (!memberField) {
    return res.status(403).json({ message: "You are not authorized" });
  }

  const result = await community.updateOne(
    { _id: communityId },
    { $addToSet: { [memberField]: userId } },
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Community Not Found" });
  }

  if (result.modifiedCount === 0) {
    return res
      .status(200)
      .json({ message: "You Have Already Joined The Community!" });
  }

  return res.status(200).json({ message: "Joined Community Successfully." });
};

export const updateCommunity = async (req, res) => {
  const communityId = req.params.id;
  const communityData = pickAllowedFields(req.body, communityEditableFields);

  try {
    const updatedCommunity = await community
      .findByIdAndUpdate(
        communityId,
        { $set: communityData },
        { new: true, runValidators: true },
      )
      .select(communityReadProjection);

    if (updatedCommunity) {
      return res.status(200).json({
        message: "Community has been updated successfully.",
        community: sanitizeCommunityForRead(updatedCommunity),
      });
    }
  } catch (error) {
    if (isDuplicateCommunityNameError(error)) {
      return sendDuplicateCommunityName(res);
    }

    throw error;
  }

  return res
    .status(404)
    .json({ message: "There is no community with such id to update." });
};

export const deleteCommunity = async (req, res) => {
  const communityId = req.params.id;
  const result = await community.deleteOne({ _id: communityId });

  if (result.deletedCount > 0) {
    return res
      .status(200)
      .json({ message: "Community has been deleted successfully." });
  }

  return res.status(404).json({ message: "Community Not Found!" });
};

export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const communityId = req.params.communityId;
    const coverImageUrl = req.file.filename;
    const communityData = await community
      .findByIdAndUpdate(
        communityId,
        { $set: { coverImage_url: coverImageUrl } },
        { new: true, runValidators: true },
      )
      .select(communityReadProjection);

    if (!communityData) {
      await cleanupUploadedRequestFile(req);
      return res.status(404).json({ message: "Community Not Found!" });
    }

    const safeCommunity = sanitizeCommunityForRead(communityData);
    safeCommunity.coverImage_url = buildUploadUrl(coverImageUrl, req);

    return res.status(200).json({
      message: "Community cover image uploaded successfully",
      coverImage_url: safeCommunity.coverImage_url,
      community: safeCommunity,
    });
  } catch (error) {
    await cleanupUploadedRequestFile(req);

    throw error;
  }
};
