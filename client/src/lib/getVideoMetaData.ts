export type VideoMetadata = {
  duration: number,
  width: number,
  height: number,
}

export const getVideoMetaData = (videoFile: File): Promise<VideoMetadata> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
      })
    }
    video.onerror = () => reject(new Error("Failed to load vide metadata"));
    video.src = URL.createObjectURL(videoFile);

  })
}