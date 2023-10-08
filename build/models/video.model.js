"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
function default_1(sequelize) {
    return sequelize.define("video", {
        upload_url: {
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            type: sequelize_1.DataTypes.UUID,
            allowNull: false
        },
        transcript: {
            defaultValue: "",
            type: sequelize_1.DataTypes.STRING
        },
        completed: {
            defaultValue: false,
            type: sequelize_1.DataTypes.BOOLEAN
        },
        last_chunk: {
            defaultValue: 0,
            type: sequelize_1.DataTypes.INTEGER
        },
        file_size: {
            defaultValue: 0,
            type: sequelize_1.DataTypes.INTEGER
        },
        poster: {
            type: sequelize_1.DataTypes.BLOB("medium")
        },
    });
}
exports.default = default_1;
