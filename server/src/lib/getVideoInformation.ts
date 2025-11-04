import ffmpeg from "fluent-ffmpeg";
import path from "path"
import fs from "fs";


type VideoInformation = {
  width?: number,
  height?: number,
  duration?: number,
}

export async function getVideoInformations(buffer: Buffer): Promise<VideoInformation> {
  const tempPath = path.join(process.cwd(), "temp_video.mp4");
  await fs.promises.writeFile(tempPath, buffer);
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(tempPath, async (err, metadata) => {
      await fs.promises.unlink(tempPath);
      if (err) return reject(err);
      const videoStream = metadata.streams.find(s => s.codec_type === "video");
      resolve({
        width: videoStream?.width,
        height: videoStream?.height,
        duration: metadata.format.duration ? Math.floor(metadata.format.duration) : undefined,
      })
    })
  })
}

