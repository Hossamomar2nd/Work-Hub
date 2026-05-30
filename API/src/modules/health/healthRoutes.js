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

const isConnected = ({ status }) => status === "connected";

router.get("/", async (req, res) => {
  const mongo = getMongoStatus();
  const postgres = await getPostgresStatus();
  const isHealthy = [mongo, postgres].every(isConnected);

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? "ok" : "degraded",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    mongo,
    postgres,
  });
});

export default router;
