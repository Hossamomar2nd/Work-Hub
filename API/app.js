import express from "express";
import cors from "cors";
import { registerRoutes } from "./src/routes/index.js";
import { errorHandler } from "./src/middleware/error.middleware.js";
import { notFoundHandler } from "./src/middleware/not-found.middleware.js";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

registerRoutes(app);
app.use(express.static("./src/middleware/upload"));
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
