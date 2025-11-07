import { VideoMetadata } from "@/lib/getVideoMetaData";
import { FieldErrors } from "react-hook-form";
import { formatDuration } from "../lib/formatDuration";


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
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-destructive/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="font-semibold text-sm">Validation Errors</h2>
          </div>
          <ul className="p-3 space-y-1">
            {Object.keys(errors).map((key) => (
              <li
                key={key}
                className="flex items-center gap-2 text-[12px] font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/60" />
                {(errors[key as keyof typeof errors]?.message as string) ??
                  "Unknown error"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default VideoInformations;
