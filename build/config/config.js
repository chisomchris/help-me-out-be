"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const videos_route_1 = __importDefault(require("../routes/videos.route"));
const error_handler_1 = require("../middlewares/error-handler");
const not_found_1 = require("../middlewares/not-found");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
// app.use(express.static("videos"));
app.use(express_1.default.static("public"));
// ROUTES
app.use("/api/v1/videos", videos_route_1.default);
// MIDDLEWARES
app.use(not_found_1.notFound);
app.use(error_handler_1.errorHandler);
// CONSTANTS
const PORT = process.env.PORT || 4000;
module.exports = { app, PORT };
