"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamVideo = exports.uploadStreamData = exports.createStreamLink = void 0;
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const joi_1 = __importDefault(require("joi"));
const models_1 = require("../models");
const writeStream_1 = require("../utils/writeStream");
const screenshot_1 = require("../services/screenshot");
const createStreamLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const video = yield models_1.db.video.create();
        const { upload_url } = video.toJSON();
        res.status(201).json({
            success: true,
            link: upload_url
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.createStreamLink = createStreamLink;
const uploadStreamData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No data supplied"
            });
        }
        if (req.body.isLastBlock) {
            const { error } = joi_1.default.string().validate(req.body.isLastBlock);
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "isLastBlock must be a string"
                });
            }
            const isLastBlock = Number(req.body.isLastBlock);
            if (!(isLastBlock == 0 || isLastBlock == 1)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Data: isLastBlock must be either '0' or '1'"
                });
            }
        }
        if (req.body.nextBlock) {
            const { error } = joi_1.default.number().integer().greater(0).validate(Number(req.body.nextBlock));
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "nextBlock must be an integer greater than zero"
                });
            }
        }
        const { isLastBlock, nextBlock } = req.body;
        const { upload_url } = req.params;
        if (!(0, uuid_1.validate)(upload_url) || (0, uuid_1.version)(upload_url) !== 4) {
            return res.status(400).json({
                success: false,
                message: "Invalid Url"
            });
        }
        const video = yield models_1.db.video.findOne({ where: { upload_url } });
        if (!video) {
            return res.status(400).json({
                success: false,
                message: "Invalid Url"
            });
        }
        const { completed, last_chunk, } = video.toJSON();
        if (completed) {
            return res.status(400).json({
                success: false,
                message: "Stream Closed"
            });
        }
        if (last_chunk + 1 !== Number(nextBlock)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chunk"
            });
        }
        if (isLastBlock && Boolean(Number(isLastBlock))) {
            const success = yield (0, writeStream_1.writeStream)(upload_url, req.file.buffer);
            if (!success) {
                return res.status(500).json({
                    success: false,
                    message: 'Error writing to file'
                });
            }
            const stats = fs_1.default.statSync(path_1.default.join(__dirname, "../videos", `${upload_url}.mp4`));
            video.last_chunk += 1;
            video.completed = true;
            video.file_size = stats.size;
            yield video.save();
            // take screenshot
            try {
                (0, screenshot_1.getScreenshot)(upload_url);
            }
            catch (error) {
                console.error(error);
            }
            res.status(200).json({
                success: true,
                completed: true,
                message: "video saved successfully",
                file_size: video.file_size
            });
        }
        else {
            const success = yield (0, writeStream_1.writeStream)(upload_url, req.file.buffer);
            if (!success) {
                return res.status(500).json({
                    success: false,
                    message: 'Error writing to file'
                });
            }
            video.last_chunk += 1;
            yield video.save();
            res.status(200).json({
                success: true,
                last_chunk: video.last_chunk,
                message: "Data saved successfully"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.uploadStreamData = uploadStreamData;
const streamVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { upload_url } = req.params;
        const video = yield models_1.db.video.findOne({ where: { upload_url } });
        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Upload Link does not exist'
            });
        }
        const videoPath = path_1.default.join(__dirname, "../videos", `${upload_url}`);
        if (!fs_1.default.existsSync(videoPath)) {
            return res.status(404).json({
                success: false,
                message: 'Upload Link does not exist'
            });
        }
        res.setHeader("Content-Type", "video/mp4");
        const videoStream = fs_1.default.createReadStream(videoPath);
        videoStream.pipe(res);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});
exports.streamVideo = streamVideo;
