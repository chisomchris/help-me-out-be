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
exports.writeStream = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const writeStream = (upload_url, buffer) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, "../videos"))) {
            fs_1.default.mkdirSync(path_1.default.join(__dirname, "../videos"), { recursive: true });
        }
        const fileStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, "../videos", `${upload_url}`), { flags: "a" });
        fileStream.write(buffer, "base64");
        fileStream.on("error", () => reject(false));
        fileStream.on("finish", () => resolve(true));
        fileStream.end();
    });
});
exports.writeStream = writeStream;
