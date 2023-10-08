import ffmpeg from 'fluent-ffmpeg'
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath)
import path from 'path'
import fs from 'fs'

export const getScreenshot = (filename: string) => {
    if (fs.existsSync(path.join(__dirname, '../public/images/'))) {
        ffmpeg({ source: path.join(__dirname, '../videos', `${filename}.mp4`) })
            .on("end", () => { console.log("Done") })
            .on("error", err => { console.error(err) })
            .screenshot({
                filename,
                timemarks: [1],
                folder: path.join(__dirname, '../public/images/')
            })
    } else {
        fs.mkdirSync(path.join(__dirname, '../public/images/'), { recursive: true })
        ffmpeg({ source: path.join(__dirname, '../videos', `${filename}.mp4`) })
            .on("end", () => { console.log("Done") })
            .on("error", err => { console.error(err) })
            .screenshot({
                filename,
                timemarks: [5],
                folder: path.join(__dirname, '../public/images/')
            })
    }

}