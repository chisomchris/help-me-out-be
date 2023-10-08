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
exports.transcribeVideo = void 0;
const ffmpeg_1 = require("@ffmpeg-installer/ffmpeg");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.path);
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sdk_1 = require("@deepgram/sdk");
const check_1 = require("./check");
const apiKey = "c2513689b2c33bd9f937eb7c9a39669ea8d24c5c";
// const apiKey = process.env.DEEPGRAM_API_KEY!
const transcribeAudio = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const deepgram = new sdk_1.Deepgram(apiKey);
        try {
            const audioSource = {
                stream: fs_1.default.createReadStream(filename),
                mimetype: "audio/wav",
            };
            const response = yield deepgram.transcription.preRecorded(audioSource, {
                punctuate: true,
                utterances: true,
            });
            if (!response) {
                reject({ success: false });
            }
            if (response && response.results) {
                const upload_url = filename.split("temp")[1].slice(1).split(".")[0];
                const transcript = JSON.stringify(response.results.channels[0].alternatives[0]);
                return console.log(transcript);
                // const video = await db.video.findOne({
                //   where: {
                //     upload_url,
                //   },
                // });
                // if (!video) {
                //   reject({ success: false });
                // }
                // if (video) {
                //   video.transcript = transcript;
                //   await video.save();
                //   resolve({ success: true, filename, upload_url });
                // }
            }
        }
        catch (error) {
            reject({ success: false });
        }
    }));
});
const extractAudio = (videoFilename) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, "../temp/"))) {
            fs_1.default.mkdirSync(path_1.default.join(__dirname, "../temp/"), { recursive: true });
        }
        const videoPath = path_1.default.join(__dirname, "../videos", `${videoFilename}.mp4`);
        const audioPath = path_1.default.join(__dirname, "../temp/", `${videoFilename}.wav`);
        const command = (0, fluent_ffmpeg_1.default)(videoPath);
        command.toFormat("wav").audioCodec("pcm_s16le").save(audioPath);
        command
            .on("end", () => {
            resolve(audioPath);
        })
            .on("error", (err) => {
            console.error("err");
            reject(err);
        })
            .run();
    });
});
const transcribeVideo = (videoName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hasAudio = yield (0, check_1.checkAudio)(path_1.default.join(__dirname, "../videos", `${videoName}.mp4`));
        if (!hasAudio) {
            throw new Error("Media does not contain Auidio stream");
        }
        const audioPath = yield extractAudio(videoName);
        if (!audioPath) {
            throw new Error("No Audio provided");
        }
        const data = yield transcribeAudio(audioPath);
        if (!data) {
            fs_1.default.unlinkSync(audioPath);
            throw new Error("Transcription error");
        }
        fs_1.default.unlinkSync(audioPath);
    }
    catch (error) {
        console.error(error);
    }
});
exports.transcribeVideo = transcribeVideo;
try {
    transcribeAudio(path_1.default.join(__dirname, "../temp/", `test.wav`));
}
catch (error) {
    console.error(error);
}
