import mysql2 from "mysql2"
import { Sequelize } from "sequelize"
const dbconfig = {
    HOST: process.env.MYSQL_HOST!,
    USER: process.env.MYSQL_USER!,
    PASSWORD: process.env.MYSQL_PASSWORD!,
    DB: process.env.MYSQL_DB!,
    pool: {
        max: 100,
        min: 0,
        idle: 10000,
        acquire: 30000
    }
}

export const sequelize = new Sequelize(
    dbconfig.DB,
    dbconfig.USER,
    dbconfig.PASSWORD,
    {
        host: dbconfig.HOST,
        dialectModule: mysql2,
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
    }
)