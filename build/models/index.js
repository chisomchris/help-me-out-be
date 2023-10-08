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
exports.db = void 0;
const dbconfig_1 = require("../config/dbconfig");
const sequelize_1 = require("sequelize");
const video_model_1 = __importDefault(require("./video.model"));
exports.db = {
    sequelize: dbconfig_1.sequelize,
    Sequelize: sequelize_1.Sequelize,
    video: (0, video_model_1.default)(dbconfig_1.sequelize),
    connectToDatabase: function () {
        return __awaiter(this, void 0, void 0, function* () { return yield dbconfig_1.sequelize.authenticate(); });
    }
};
