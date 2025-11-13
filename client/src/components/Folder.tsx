import { Folder as FolderIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from "./ui/context-menu";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { toast } from "sonner";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Dialog, DialogTrigger, DialogHeader, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Spinner } from "./ui/spinner";



type FolderProps = {
  folderName: string;
  videosCount: number;
  folderId: Id<"folders">;
  handleFolderChange: (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  isDefault: boolean;
};

const Folder = ({
  folderName,
  videosCount,
  handleFolderChange,
  folderId,
  isDefault,
}: FolderProps) => {
  const deleteFolder = useMutation(api.folders.deleteFolderById);
  const duplicateFolder = useMutation(api.folders.duplicateFolder);
  const workspace = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteFolder = async () => {
    try {
      setIsDeleting(true);
      await deleteFolder({ id: folderId });
      toast.success("Folder deleted successfully", {
        position: "bottom-right",
      });
    } catch {
      toast.error("Failed to delete folder", {
        position: "bottom-right",
        className: "text-destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFolderDuplication = async () => {
    try {
      if (workspace) {
        await duplicateFolder({ id: folderId, workspaceId: workspace?._id });
        toast.success("Folder Duplicated successfully", {
          position: "bottom-right",
        });
      }
    } catch {
      toast.error("Failed to duplicate folder", {
        position: "bottom-right",
        className: "text-destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <ContextMenu>
          <ContextMenuTrigger>
            <button
              className="px-4 py-2 w-full border border-border bg-card flex rounded-sm justify-between items-center  relative overflow-hidden hover:cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all text-start"
              onClick={handleFolderChange}
            >
              <div>
                <h4 className="font-semibold text-[14px]  text-card-foreground truncate max-w-[16ch]">
                  {folderName}
                </h4>
                <h5 className="text-muted-foreground text-xs capitalize">
                  {videosCount} videos
                </h5>
              </div>
              <FolderIcon fill={"white"} />
              <div className="absolute blur-3xl w-[100px] h-[100px] bg-[#ddd] -top-[50px] -left-[50px] opacity-15 rounded-full"></div>
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem>
              Rename Folder
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Move Folder
              <ContextMenuShortcut>⌘M</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleFolderDuplication}>
              Duplicate
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <DialogTrigger disabled={isDefault} asChild>
              <ContextMenuItem
                className="text-destructive"
                disabled={isDefault}
              >
                Delete
                <ContextMenuShortcut className="text-destructive">
                  ⌘⌫
                </ContextMenuShortcut>
              </ContextMenuItem>
            </DialogTrigger>
          </ContextMenuContent>
        </ContextMenu>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              Folder and remove everything associated with it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button onClick={handleDeleteFolder} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  Deleting
                  <Spinner/>
                </>
              ) : (
                  "Delete Folder"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Folder;
