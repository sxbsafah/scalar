import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Upload, Video } from "lucide-react";
import { Button } from "./ui/button";
import FileUpload from "./FileUpload";
import VideoForm from "./VideoForm";
import { getVideoMetaData, type VideoMetadata } from "@/lib/getVideoMetaData";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Doc, Id } from "convex/_generated/dataModel";
import { UserButton } from "@clerk/clerk-react";
import { Input } from "./ui/input";

export const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  thumbnail: z
    .any()
    .refine(
      (file) => file instanceof File || file?.[0] instanceof File,
      "Thumbnail is required"
    ),
  file: z.optional(z.string()),
  workspace: z.string().min(1, "Workspace is required"),
  folders: z.string().min(1, "Folder is required"),
});
export type VideoSchemaType = z.infer<typeof videoSchema>;

const Header = ({
  workspaces,
}: {
  workspaces: (Doc<"workspaces"> | null)[];
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [videoMetaData, setVideoMetaData] = useState<VideoMetadata | null>(
    null
  );
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [selectedWorkspace, setSelectedWorkspace] =
    useState<Id<"workspaces"> | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<VideoSchemaType>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      thumbnail: "",
      workspace: "",
      folders: "",
    },
  });

  useEffect(() => {
    const loadMetadata = async () => {
      if (file) setVideoMetaData(await getVideoMetaData(file));
    };
    loadMetadata();
  }, [file]);

  // Function to reset all states when explicitly needed
  const resetAllStates = () => {
    setFile(null);
    setVideoMetaData(null);
    setThumbnail(null);
    setTitle("");
    setSelectedWorkspace(null);
    setUploadProgress(0);
    reset();
  };

  return (
    <header className="flex items-center justify-between py-4 w-full mb-12">
      <div>
        <Input className="w-[400px]"/>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Button size="sm">
            <Video />
            Record
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload />
                Upload
              </Button>
            </DialogTrigger>

            <DialogContent showCloseButton={false} custom>
              {file && videoMetaData ? (
                <VideoForm
                  file={file}
                  workspaces={workspaces}
                  videoMetaData={videoMetaData}
                  handleSubmit={handleSubmit}
                  control={control}
                  setError={setError}
                  isSubmitting={isSubmitting}
                  errors={errors}
                  thumbnail={thumbnail}
                  setThumbnail={setThumbnail}
                  title={title}
                  setTitle={setTitle}
                  selectedWorkspace={selectedWorkspace}
                  setSelectedWorkspace={setSelectedWorkspace}
                  uploadProgress={uploadProgress}
                  setUploadProgress={setUploadProgress}
                  onClose={() => setIsDialogOpen(false)}
                  onReset={resetAllStates}
                />
              ) : (
                <FileUpload setFile={setFile} />
              )}
            </DialogContent>
          </Dialog>
        </div>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
