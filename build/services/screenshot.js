"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScreenshot = void 0;
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.path);
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getScreenshot = (filename) => {
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '../public/images/'))) {
        (0, fluent_ffmpeg_1.default)({ source: path_1.default.join(__dirname, '../videos', `${filename}.mp4`) })
            .on("end", () => { console.log("Done"); })
            .on("error", err => { console.error(err); })
            .screenshot({
            filename,
            timemarks: [1],
            folder: path_1.default.join(__dirname, '../public/images/')
        });
    }
    else {
        fs_1.default.mkdirSync(path_1.default.join(__dirname, '../public/images/'), { recursive: true });
        (0, fluent_ffmpeg_1.default)({ source: path_1.default.join(__dirname, '../videos', `${filename}.mp4`) })
            .on("end", () => { console.log("Done"); })
            .on("error", err => { console.error(err); })
            .screenshot({
            filename,
            timemarks: [5],
            folder: path_1.default.join(__dirname, '../public/images/')
        });
    }
};
exports.getScreenshot = getScreenshot;
