import { ClerkLoaded, ClerkLoading } from "@clerk/clerk-react";
import Loader from "@/components/Loader";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import Folder from "@/components/Folder";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useWorkspace } from "@/hooks/useWorkspace";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import VideoCard from "@/components/VideoCard";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import FoldersSkeletonLoading from "@/components/FoldersSkeletonLoading";
import { Id } from "../../convex/_generated/dataModel";
import VideoCardSkeleton from "@/components/VideCardSkeleton";
import { timeAgo } from "@/lib/timeAgo";



export const folderSchema = z.object({
  name: z.string().min(2, "Folder name must be at least 2 characters long"),
});

type FolderType = z.infer<typeof folderSchema>;

const Library = () => {
  const [folder, setFolder] = useState<Id<"folders"> | undefined>(undefined);
  const [initialFoldersAnimation, setInitialFoldersAnimation] = useState(true);
  const [initialVideosAnimation, setInitialVideosAnimation] = useState(true);
  const workspace = useWorkspace();
  const folders = useQuery(
    api.folders.getFoldersByWorkspaceId,
    workspace
      ? {
          workspaceId: workspace?._id,
        }
      : "skip"
  );
  const videos = useQuery(
    api.videos.getVideosByFolderId,
    folder && workspace
      ? {
          folderId: folder,
        }
      : "skip"
  );

  useEffect(() => {
    if (workspace) setFolder(workspace.defaultFolder); 
    if (!folder) return;
    setInitialFoldersAnimation(true);
    const id = setTimeout(() => setInitialFoldersAnimation(false), 0);
    return () => clearTimeout(id);
  }, [workspace]);
  
  useEffect(() => {
    if (!folder) return;
    setInitialVideosAnimation(true);
    const id = setTimeout(() => setInitialVideosAnimation(false), 0);
    return () => clearTimeout(id);
  }, [folder]);


  const {
    handleSubmit,
    setError,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<FolderType>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
    },
  });
  const createFolder = useMutation(api.folders.createFolder);

  const onFolderCreation = async ({ name }: FolderType) => {
    try {
      if (workspace) {
        const folder = await createFolder({
          workspaceId: workspace._id,
          folderName: name,
        });

        if ((folder as { errors: string[] }).errors) {
          setError("name", {
            message: "Folder with This Name Already Exist",
          });
          return;
        }
      }
      reset({
        name: "",
      }); // reset other form state but keep defaultValues and form values
    } catch (err) {
      setError("name", {
        message: (err as Error).message,
      });
    }
  };
  return (
    <>
      <ClerkLoaded>
        <div className="flex flex-col ">
          <div className="flex justify-between items-center ">
            <Title Title={"Folders"} subTitle={"Manage your folders"} />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"outline"}>
                  <FolderPlus />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form
                  action=""
                  onSubmit={handleSubmit(onFolderCreation)}
                  className="space-y-4"
                >
                  <DialogHeader>
                    <DialogTitle>Add New Folder</DialogTitle>
                    <DialogDescription>
                      Add new Folder to your workspace here. Click save when
                      you&apos;done
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <Controller
                      name="name"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Folder Name</FieldLabel>
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter Folder Name"
                          />
                          {fieldState.invalid && (
                            <FieldError
                              className="field-error-message"
                              errors={[fieldState.error]}
                            />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Spinner />
                          Creating
                        </>
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 mb-10">
            {folders ? (
              folders.map((folder, idx) => (
                <motion.div
                  key={folder._id}
                  initial={{ opacity: 0, y: 20 }}
                  layout
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.1,
                    delay: initialFoldersAnimation ? idx * 0.1 : 0,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <Folder
                    folderName={folder.name}
                    videosCount={folder.videosCount}
                    onClick={() => {
                      setFolder(folder._id);
                    }}
                  />
                </motion.div>
              ))
            ) : (
              <>
                <FoldersSkeletonLoading />
                <FoldersSkeletonLoading />
                <FoldersSkeletonLoading />
                <FoldersSkeletonLoading />
                <FoldersSkeletonLoading />
                <FoldersSkeletonLoading />
                <FoldersSkeletonLoading />
                <FoldersSkeletonLoading />
              </>
            )}
          </div>
          <div className="mt-6 mb-4">
            <Title Title={"Videos"} subTitle={"Manage Your Videos"} />
          </div>
          <div
            className={`${videos?.length !== 0 || videos === undefined ? "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] items-start gap-2" : "flex flex-col grow items-center"}`}
          >
            {videos === undefined ? (
              <>
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
                <VideoCardSkeleton />
              </>
            ) : videos.length === 0 ? (
              <h1 className="text-3xl">No Videos To see here</h1>
            ) : (
              videos?.map((video, idx) => (
                <motion.div
                  key={video.title}
                  initial={{ opacity: 0, y: 20 }}
                  layout
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: initialVideosAnimation ? idx * 0.1 : 0,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <VideoCard
                    title={video.title}
                    watchCount={video.watchCount}
                    commentsCount={video.commentsCount}
                    user={video.user?.username as string}
                    time={timeAgo(video._creationTime)}
                    avatar={video.user?.profileImageUrl as string}
                    thumbnail={video.thumbnailUrl}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </ClerkLoaded>
      <ClerkLoading>
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      </ClerkLoading>
    </>
  );
};

export default Library;
