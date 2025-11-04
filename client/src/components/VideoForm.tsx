import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Group, XIcon, ImageUp } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  z } from "zod";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "./ui/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";
import VideoInformations from "./VideoInformations";
import { useState } from "react";

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  thumbnail: z
    .any()
    .refine(
      (file) => file instanceof File || file?.[0] instanceof File,
      "Thumbnail is required"
    ),
  workspace: z.string().min(1, "Workspace is required"),
  folders: z.string().min(1, "Folder is required"),
});

type VideoSchemaType = z.infer<typeof videoSchema>;

const VideoForm = ({ file }: { file: File }) => {
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const { handleSubmit, control } = useForm<VideoSchemaType>({
    resolver: zodResolver(videoSchema),
  });

  const onSubmit = (data: VideoSchemaType) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex items-center justify-between border-b-border border-b px-2 py-1">
        <h1 className="font-bold text-card-foreground">Upload Video</h1>
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className={`ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`}
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>

      <div className="w-[900px] px-8 py-3">
        <h1 className="text-[24px] font-bold mb-2">Details</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex gap-6">
              {/* LEFT COLUMN */}
              <div className="w-1/2">
                {/* --- Title --- */}
                <Controller
                  name="title"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex flex-col ">
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
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* --- Thumbnail --- */}
                <Controller
                  name="thumbnail"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-4">
                      <div className="flex flex-col ">
                        <FieldLabel className="font-semibold">
                          Thumbnail
                        </FieldLabel>
                        <FieldDescription>
                          Set a thumbnail that reflects your video content
                        </FieldDescription>
                      </div>
                      <div className={`w-full h-24 ${!thumbnail && "border-dashed border-border border-2"}  mb-2 flex flex-col items-center justify-center gap-2 cursor-pointer`}>
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
                            className={`hidden`}
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                              if (e.target.files?.[0]) {
                                setThumbnail(e.target.files?.[0]);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* --- Workspace --- */}
                <Controller
                  name="workspace"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="mt-4">
                      <div className="flex flex-col ">
                        <FieldLabel className="font-semibold">
                          Workspace
                        </FieldLabel>
                        <FieldDescription>
                          Add your video to a workspace to organize content
                        </FieldDescription>
                      </div>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full flex border-input border gap-2 px-3 py-2 rounded-md bg-input/20">
                          <Group />
                          <SelectValue placeholder="Select a workspace" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Workspace A">
                              Workspace A
                            </SelectItem>
                            <SelectItem value="Workspace B">
                              Workspace B
                            </SelectItem>
                            <SelectItem value="Workspace C">
                              Workspace C
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* --- Folders --- */}
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
                        value={field.value}
                      >
                        <SelectTrigger className="w-full flex border-input border gap-2 px-3 py-2 rounded-md bg-input/20">
                          <Group />
                          <SelectValue placeholder="Select a folder" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Folder 1">Folder 1</SelectItem>
                            <SelectItem value="Folder 2">Folder 2</SelectItem>
                            <SelectItem value="Folder 3">Folder 3</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* RIGHT COLUMN */}
              <div className="w-1/2">
                <VideoInformations file={file} thumbnail={thumbnail}/>
              </div>
            </div>
          </FieldGroup>
        </form>
      </div>
      <div className="flex items-center justify-between border-t border-border mt-6 px-2 py-3">
        <Progress value={50} className="w-[400px]" />
        <Button type="submit">Upload</Button>
      </div>
    </div>
  );
};

export default VideoForm;
