type VideoInformationsProps = {
  file: File;
  thumbnail: File | null;
};

const VideoInformations = ({ file, thumbnail }: VideoInformationsProps) => {
  return (
    <div className="rounded-2xl border border-border">
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
              {file.name}
            </p>
          </div>
          <div>
            <h1 className="text-muted-foreground font-semibold">Resolution</h1>
            <p className="text-card-foreground text-[12px] font-medium">
              {file.name}
            </p>
          </div>{" "}
          <div>
            <h1 className="text-muted-foreground font-semibold">Duration</h1>
            <p className="text-card-foreground text-[12px] font-medium">
              00:05:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInformations;
