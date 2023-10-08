import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg"
ffmpeg.setFfmpegPath(ffmpegPath)
import fs from "fs"
import path from "path"
import { Deepgram } from "@deepgram/sdk";
import { db } from "../models";
import { checkAudio } from "./check";
const apiKey = process.env.DEEPGRAM_API_KEY!


const transcribeAudio = async (filename: string): Promise<{ success: boolean, filename?: string, upload_url?: string }> => {
  return new Promise(async (resolve, reject) => {
    const deepgram = new Deepgram(apiKey);
    try {
      const audioSource = {
        stream: fs.createReadStream(filename),
        mimetype: "audio/wav",
      };
      const response = await deepgram.transcription.preRecorded(audioSource, {
        punctuate: true,
        utterances: true,
      });
      if (!response) {
        reject({ success: false });
      }
      if (response && response.results) {
        const upload_url = filename.split("temp")[1].slice(1).split(".")[0];
        const transcript = JSON.stringify(
          response.results.channels[0].alternatives[0]
        );
        const video = await db.video.findOne({
          where: {
            upload_url,
          },
        });
        if (!video) {
          reject({ success: false });
        }
        if (video) {
          video.transcript = transcript;
          await video.save();
          resolve({ success: true, filename, upload_url });
        }
      }
    } catch (error) {
      reject({ success: false });
    }
  });
};

const extractAudio = async (videoFilename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path.join(__dirname, "../temp/"))) {
      fs.mkdirSync(path.join(__dirname, "../temp/"), { recursive: true })
    }
    const videoPath = path.join(__dirname, "../videos", `${videoFilename}.mp4`);
    const audioPath = path.join(__dirname, "../temp/", `${videoFilename}.wav`);
    const command = ffmpeg(videoPath);
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
};

export const transcribeVideo = async (videoName: string) => {
  try {
    const hasAudio = await checkAudio(path.join(__dirname, "../videos", `${videoName}.mp4`));
    if (!hasAudio) {
      throw new Error("Media does not contain Auidio stream");
    }
    const audioPath = await extractAudio(videoName);
    if (!audioPath) {
      throw new Error("No Audio provided");
    }
    const data = await transcribeAudio(audioPath);
    if (!data) {
      fs.unlinkSync(audioPath);
      throw new Error("Transcription error");
    }
    fs.unlinkSync(audioPath);
  } catch (error) {
    console.error(error);
  }
};
