import fs from 'fs'
import path from 'path'
export const writeStream = async (upload_url: string, buffer: Buffer) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path.join(__dirname, "../videos"))) {
            fs.mkdirSync(path.join(__dirname, "../videos"), { recursive: true })
        }
        const fileStream = fs.createWriteStream(
            path.join(__dirname, "../videos", `${upload_url}`),
            { flags: "a" }
        )

        fileStream.write(buffer, "base64")

        fileStream.on("error", () => reject(false))

        fileStream.on("finish", () => resolve(true))

        fileStream.end()
    })
}