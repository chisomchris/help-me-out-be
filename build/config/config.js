"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const videos_route_1 = __importDefault(require("../routes/videos.route"));
const error_handler_1 = require("../middlewares/error-handler");
const not_found_1 = require("../middlewares/not-found");
exports.app = (0, express_1.default)();
dotenv_1.default.config();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, morgan_1.default)("dev"));
// app.use(express.static("videos"));
exports.app.use(express_1.default.static("public"));
// ROUTES
exports.app.use("/api/v1/videos", videos_route_1.default);
// MIDDLEWARES
exports.app.use(not_found_1.notFound);
exports.app.use(error_handler_1.errorHandler);
// CONSTANTS
exports.PORT = process.env.PORT || 4000;
