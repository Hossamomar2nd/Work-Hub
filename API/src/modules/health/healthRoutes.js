import express from "express";
import mongoose from "mongoose";
import prisma from "../../config/prisma.js";

const router = express.Router();

const mongoConnectionStates = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const getMongoStatus = () => ({
  status: mongoConnectionStates[mongoose.connection.readyState] || "unknown",
});

const getPostgresStatus = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "connected",
    };
  } catch {
    return {
      status: "unavailable",
    };
  }
};

router.get("/", async (req, res) => {
  const postgres = await getPostgresStatus();

  return res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    mongo: getMongoStatus(),
    postgres,
  });
});

export default router;
