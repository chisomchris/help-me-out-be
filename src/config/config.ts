import express from "express"
import cors from "cors"
import morgan from "morgan"
import dotenv from "dotenv"
import videoRouter from "../routes/videos.route"
import { errorHandler } from "../middlewares/error-handler"
import { notFound } from "../middlewares/not-found"

export const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// app.use(express.static("videos"));
app.use(express.static("public"));

// ROUTES
app.use("/api/v1/videos", videoRouter);

// MIDDLEWARES
app.use(notFound);
app.use(errorHandler);

// CONSTANTS
export const PORT = process.env.PORT || 4000;
