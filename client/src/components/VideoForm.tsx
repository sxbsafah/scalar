import { Group, XIcon, ImageUp, Folder } from "lucide-react";
import { Controller } from "react-hook-form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "./ui/select";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import VideoInformations from "./VideoInformations";
import { SetStateAction } from "react";
import { isAllowedVideo } from "@/lib/isAllowedVideo";
import { isAllowedImage } from "@/lib/isAllowedImage";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Spinner } from "./ui/spinner";
import { type VideoMetadata } from "@/lib/getVideoMetaData";
import useConvexUser from "@/hooks/useConvexUser";
import axios from "axios";
import { UseFormHandleSubmit, Control, UseFormSetError } from "react-hook-form";
import { VideoSchemaType } from "@/components/Header";
import { FieldErrors } from "react-hook-form";
import Loader from "./Loader";
import { toast } from "sonner";

const VideoForm = ({
  file,
  workspaces,
  videoMetaData,
  handleSubmit,
  control,
  isSubmitting,
  errors,
  setError,
  thumbnail,
  setThumbnail,
  title,
  setTitle,
  selectedWorkspace,
  setSelectedWorkspace,
  uploadProgress,
  setUploadProgress,
  onClose,
  onReset,
}: {
  file: File;
  workspaces: (Doc<"workspaces"> | null)[];
  videoMetaData: VideoMetadata;
  handleSubmit: UseFormHandleSubmit<VideoSchemaType, VideoSchemaType>;
  control: Control<VideoSchemaType, unknown, VideoSchemaType>;
  isSubmitting: boolean;
  errors: FieldErrors<{ title: string; thumbnail: unknown; workspace: string; folders: string; file?: string | undefined; }>;
  setError: UseFormSetError<VideoSchemaType>;
  thumbnail: File | null;
  setThumbnail: React.Dispatch<SetStateAction<File | null>>;
  title: string;
  setTitle: React.Dispatch<SetStateAction<string>>;
  selectedWorkspace: Id<"workspaces"> | null;
  setSelectedWorkspace: React.Dispatch<SetStateAction<Id<"workspaces"> | null>>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<SetStateAction<number>>;
  onClose: () => void;
  onReset: () => void;
}) => {
  const user = useConvexUser();
  const folders = useQuery(
    api.folders.getFoldersByWorkspaceId,
    selectedWorkspace
      ? {
          workspaceId: selectedWorkspace,
        }
      : "skip"
  ) || null;

  const requestSignedUrl = useAction(api.node.getSignedUploadUrl);
  const createVideo = useAction(api.node.createVideo);

  const onSubmit = async (data: VideoSchemaType) => {
    if (!file) {
      setError("file", { message: "Video file is required" });
      return;
    }
    if (!isAllowedVideo(file)) {
      setError("file", { message: "Unsupported video format" });
      return;
    }
    if (file.size > 1024 * 1024 * 1024) {
      setError("file", { message: "Video must not exceed 1GB" });
      return;
    }
    if (!isAllowedImage(data.thumbnail)) {
      setError("thumbnail", {
        message: "Unsupported image format",
      });
      return;
    }
    if (data.thumbnail.size > 1024 * 1024 * 2) {
      setError("thumbnail", {
        message: "Image size must not exceed 2MB",
      });
      return;
    }
    if (user) {
      if (user.activeSubscriptionId) {
        if (videoMetaData.duration > 60 * 10) {
          setError("file", {
            message: "Video duration must be at most 10min",
          });
          return;
        }
        if (videoMetaData.height > 1080 && videoMetaData.width > 1920) {
          setError("file", {
            message: "Video Resolution must be at most 1920x1080",
          });
          return;
        }
      } else {
        if (videoMetaData.duration > 60 * 5) {
          setError("file", {
            message: "Video duration must be at most 5min",
          });
          return;
        }
        if (videoMetaData.height > 720 && videoMetaData.width > 1280) {
          setError("file", {
            message: "Video Resolution must be at most 1280x720",
          });
          return;
        }
      }
      try {
        const thumbnailSignature = await requestSignedUrl();
        const thumbnailFormData = new FormData();
        thumbnailFormData.append(
          "timestamp",
          thumbnailSignature.timestamp.toString()
        );
        thumbnailFormData.append("signature", thumbnailSignature.signature);
        thumbnailFormData.append("file", data.thumbnail);
        thumbnailFormData.append("timestamp", thumbnailSignature.timestamp.toString());
        thumbnailFormData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

        const videoSignature = await requestSignedUrl();
        const videoFormData = new FormData();
        videoFormData.append("timestamp", videoSignature.timestamp.toString());
        videoFormData.append("signature", videoSignature.signature);
        videoFormData.append("file", file);
        videoFormData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
        

        console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
        console.log(import.meta.env.VITE_CLOUDINARY_API_KEY);
        console.log(videoSignature.signature)
        console.log(videoSignature.timestamp.toString());
        const videoResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
          videoFormData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded / progressEvent.total!) * 100
              );
              setUploadProgress(progress);
            },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const thumbnailResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          thumbnailFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("starting creating video")
        await createVideo({
          videoPublicId: videoResponse.data.public_id,
          thumbnailPublicId: thumbnailResponse.data.public_id,
          title: data.title,
          workspace: data.workspace as Id<"workspaces">,
          folder: data.folders as Id<"folders">,
        });
        // Success! Reset and close
        toast.success("Video uploaded successfully");
        onReset();
        onClose();
      } catch (error) {
        setError("file", {
          message: (error as Error).message,
        });
      } finally {
        setUploadProgress(0);
      }
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-border border-b px-2 py-1">
        <h1 className="font-bold text-card-foreground">Details</h1>
        <button
          onClick={onClose}
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
        >
          <XIcon className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>

      <div className="w-[900px] px-8 py-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex gap-6">
              <div className="w-1/2">
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex flex-col">
                        <FieldLabel className="font-semibold text-[16px]">
                          Title
                        </FieldLabel>
                        <FieldDescription>
                          Set a title for your video
                        </FieldDescription>
                      </div>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="Title (required)"
                        className="max-w-full mb-2"
                        autoComplete="off"
                        onChange={(e) => {
                          setTitle(e.target.value);
                          field.onChange(e.target.value);
                        }}
                        value={title}
                        disabled={isSubmitting}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-4">
                      <div className="flex flex-col">
                        <FieldLabel className="font-semibold">
                          Thumbnail
                        </FieldLabel>
                        <FieldDescription>
                          Set a thumbnail that reflects your video content
                        </FieldDescription>
                      </div>
                      <div
                        className={`w-full h-24 ${!thumbnail && "border-dashed border-border border-2"} mb-2 flex flex-col items-center justify-center gap-2 cursor-pointer`}
                      >
                        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                          {!thumbnail ? (
                            <>
                              <ImageUp className="text-muted-foreground" />
                              <span className="text-muted-foreground text-sm">
                                Upload Thumbnail
                              </span>
                            </>
                          ) : (
                            <img
                              src={URL.createObjectURL(thumbnail)}
                              alt="Thumbnail preview"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isSubmitting}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                field.onChange(file);
                                setThumbnail(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </Field>
                  )}
                />

                <Controller
                  name="workspace"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-4">
                      <div className="flex flex-col">
                        <FieldLabel className="font-semibold">
                          Workspace
                        </FieldLabel>
                        <FieldDescription>
                          Add your video to a workspace to organize content
                        </FieldDescription>
                      </div>

                      <Select
                        disabled={isSubmitting}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedWorkspace(value as Id<"workspaces">);
                        }}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full flex border-input border gap-2 px-3 py-2 rounded-md bg-input/20">
                          <Group />
                          <SelectValue placeholder="Select a workspace" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {workspaces.map((workspace) => (
                              <>
                                {workspace && (
                                  <SelectItem
                                    value={workspace?._id}
                                    key={workspace?._id}
                                  >
                                    {workspace.name}
                                  </SelectItem>
                                )}
                              </>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                <Controller
                  name="folders"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-4">
                      <div className="flex flex-col gap-1">
                        <FieldLabel className="font-semibold">
                          Folders
                        </FieldLabel>
                        <FieldDescription>
                          Add your video to a folder to organize your content
                        </FieldDescription>
                      </div>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-full flex border-input border gap-2 px-3 py-2 rounded-md bg-input/20">
                          <Folder />
                          <SelectValue placeholder="Select a folder" />
                        </SelectTrigger>
                        <SelectContent>
                          {folders && folders.length > 0 ? (
                            <SelectGroup>
                              {folders.map((folder) => (
                                <SelectItem value={folder._id} key={folder._id}>
                                  {folder.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ) : folders === undefined ? (
                            <div className="flex flex-col items-center justify-center text-center p-6">
                              <div className="bg-muted/40 p-3 rounded-full mb-2">
                                <Folder className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <h2 className="text-sm font-semibold text-muted-foreground mb-1">
                                Select a workspace first
                              </h2>
                              <p className="text-xs text-muted-foreground/70 max-w-[250px]">
                                Choose a workspace to load its folders and
                                organize your videos.
                              </p>
                            </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-6">
                                  <Loader />
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>

              <div className="w-1/2">
                <VideoInformations
                  videoMetadata={videoMetaData}
                  filename={file.name}
                  thumbnail={thumbnail}
                  errors={errors}
                />
              </div>
            </div>
          </FieldGroup>
          <div className="flex items-center justify-between border-t border-border mt-6 px-2 py-3">
            <Progress value={uploadProgress} className="w-[400px]" />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  Processing
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoForm;
