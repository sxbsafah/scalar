import React from "react";
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




type FolderProps = {
  folderName: string;
  videosCount: number;
  folderId: Id<"folders">;
  onClick: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isDefault: boolean;
};

const Folder = ({ folderName, videosCount, onClick, folderId, isDefault }: FolderProps) => {
  const deleteFolder = useMutation(api.folders.deleteFolderById);

  const handleDeleteFolder = async () => {
    try {
      console.log(folderId)
      await deleteFolder({ id: folderId });
      toast.success("Folder deleted successfully", {
        position: "bottom-right"
      });
    } catch {
      toast.error("Failed to delete folder", {
        position: "bottom-right",
        className: "text-destructive",
      })
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className="px-4 py-2 w-full border border-border bg-card flex rounded-sm justify-between items-center  relative overflow-hidden hover:cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all text-start"
          onClick={onClick}
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
        <ContextMenuItem >
          Rename Folder
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem >
          Move Folder
          <ContextMenuShortcut>⌘M</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem >
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem className="text-destructive" onClick={handleDeleteFolder} disabled={isDefault}>
          Delete
          <ContextMenuShortcut className="text-destructive">⌘⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Folder;
