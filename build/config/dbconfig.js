"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const sequelize_1 = require("sequelize");
const dbconfig = {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    PASSWORD: process.env.MYSQL_PASSWORD,
    DB: process.env.MYSQL_DB,
    pool: {
        max: 100,
        min: 0,
        idle: 10000,
        acquire: 30000
    }
};
exports.sequelize = new sequelize_1.Sequelize(dbconfig.DB, dbconfig.USER, dbconfig.PASSWORD, {
    host: dbconfig.HOST,
    dialectModule: mysql2_1.default,
    dialect: "mysql",
    pool: {
        max: dbconfig.pool.max,
        min: dbconfig.pool.min,
        acquire: dbconfig.pool.acquire,
        idle: dbconfig.pool.idle
    },
    define: {
        freezeTableName: true,
        timestamps: true,
        underscored: true
    }
});
