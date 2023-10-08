import { path as ffmpegPath } from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg"
ffmpeg.setFfprobePath(ffmpegPath)

export const checkAudio = (path: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    ffmpeg.ffprobe(path, (err, data) => {
      if (err) {
        console.error(err)
        reject(false)
      } else {
        const hasAudio = data.streams.some(stream => stream.codec_type === 'audio')
        resolve(hasAudio)
      }
    })
  })
};