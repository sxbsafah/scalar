import { VideoMetadata } from "@/lib/getVideoMetaData";
import { FieldErrors } from "react-hook-form";
import { formatDuration } from "../lib/formatDuration";
import ErrorsPanel from "./ErrorsPanel";


type VideoInformationsProps = {
  thumbnail: File | null;
  videoMetadata: VideoMetadata,
  filename: string,
  errors: FieldErrors<{
    title: string;
    thumbnail: unknown;
    workspace: string;
    folders: string;
    file?: string | undefined;
  }>;
};

const VideoInformations = ({
  thumbnail,
  errors,
  videoMetadata,
  filename,
}: VideoInformationsProps) => {
  return (
    <>
      <div className="rounded-2xl border border-border mb-4">
        <div className="bg-background flex items-center justify-center h-52 rounded-2xl">
          {thumbnail ? (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="Thumbnail preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <h1 className="text-primary font-bold text-2xl">Thumbnail</h1>
          )}
        </div>
        <div>
          <div className="flex flex-col gap-4 p-2.5">
            <div>
              <h1 className="text-muted-foreground font-semibold">Filename</h1>
              <p className="text-card-foreground text-[12px] font-medium">
                {filename}
              </p>
            </div>
            <div>
              <h1 className="text-muted-foreground font-semibold">
                Resolution
              </h1>
              <p className="text-card-foreground text-[12px] font-medium">
                {`${videoMetadata.width} x ${videoMetadata.height}`}
              </p>
            </div>{" "}
            <div>
              <h1 className="text-muted-foreground font-semibold">Duration</h1>
              <p className="text-card-foreground text-[12px] font-medium">
                {formatDuration(videoMetadata.duration)}
              </p>
            </div>
          </div>
        </div>
      </div>
      {Object.keys(errors).length > 0 && <ErrorsPanel errors={errors} /> }
    </>
  );
};

export default VideoInformations;
