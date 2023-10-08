import { version, validate } from "uuid"
import fs from 'fs'
import path from 'path'
import Joi from 'joi'
import { db } from '../models'
import { Request, Response } from 'express'
import { writeStream } from "../utils/writeStream"
import { getScreenshot } from "../services/screenshot"

export const createStreamLink = async (req: Request, res: Response) => {
    try {
        const video = await db.video.create()
        const { upload_url } = video.toJSON()

        res.status(201).json({
            success: true,
            link: upload_url
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const uploadStreamData = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No data supplied"
            })
        }

        if (req.body.isLastBlock) {
            const { error } = Joi.string().validate(req.body.isLastBlock)
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "isLastBlock must be a string"
                })
            }
            const isLastBlock = Number(req.body.isLastBlock)
            if (!(isLastBlock == 0 || isLastBlock == 1)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Data: isLastBlock must be either '0' or '1'"
                })
            }

        }

        if (req.body.nextBlock) {
            const { error } = Joi.number().integer().greater(0).validate(Number(req.body.nextBlock))
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: "nextBlock must be an integer greater than zero"
                })
            }
        }

        const { isLastBlock, nextBlock } = req.body
        const { upload_url } = req.params
        if (!validate(upload_url) || version(upload_url) !== 4) {
            return res.status(400).json({
                success: false,
                message: "Invalid Url"
            })
        }

        const video = await db.video.findOne({ where: { upload_url } })
        if (!video) {
            return res.status(400).json({
                success: false,
                message: "Invalid Url"
            })
        }

        const { completed, last_chunk, } = video.toJSON()
        if (completed) {
            return res.status(400).json({
                success: false,
                message: "Stream Closed"
            })
        }

        if (last_chunk + 1 !== Number(nextBlock)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chunk"
            })
        }

        if (isLastBlock && Boolean(Number(isLastBlock))) {
            const success = await writeStream(upload_url, req.file.buffer)
            if (!success) {
                return res.status(500).json({
                    success: false,
                    message: 'Error writing to file'
                })
            }
            const stats = fs.statSync(path.join(__dirname, "../videos", `${upload_url}.mp4`))
            video.last_chunk += 1;
            video.completed = true
            video.file_size = stats.size
            await video.save()

            // take screenshot
            try {
                getScreenshot(upload_url)
            } catch (error) {
                console.error(error)
            }

            res.status(200).json({
                success: true,
                completed: true,
                message: "video saved successfully",
                file_size: video.file_size
            })
        } else {

            const success = await writeStream(upload_url, req.file.buffer)
            if (!success) {
                return res.status(500).json({
                    success: false,
                    message: 'Error writing to file'
                })
            }
            video.last_chunk += 1
            await video.save()

            res.status(200).json({
                success: true,
                last_chunk: video.last_chunk,
                message: "Data saved successfully"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const streamVideo = async (req: Request, res: Response) => {
    try {
        const { upload_url } = req.params
        const video = await db.video.findOne({ where: { upload_url } })

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Upload Link does not exist'
            })
        }

        const videoPath = path.join(__dirname, "../videos", `${upload_url}`)
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({
                success: false,
                message: 'Upload Link does not exist'
            })
        }

        res.setHeader("Content-Type", "video/mp4")
        const videoStream = fs.createReadStream(videoPath)
        videoStream.pipe(res)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}