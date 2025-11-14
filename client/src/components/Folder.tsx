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
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { useState } from "react";
import FolderDelete from "./FolderDelete";
import FolderForm from "./FolderForm";
import MoveForm from "./MoveForm";

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
  const duplicateFolder = useMutation(api.folders.duplicateFolder);
  const workspace = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [contextMenuDialogWindow, setContextMenuDialogWindow] = useState<
    "rename" | "delete" | "move"
  >("delete");

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
            <DialogTrigger
              asChild
              onClick={() => setContextMenuDialogWindow("rename")}
            >
              <ContextMenuItem>
                Rename Folder
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
            </DialogTrigger>
            <DialogTrigger onClick={() => setContextMenuDialogWindow("move")} asChild>
              <ContextMenuItem>
                Move Folder
                <ContextMenuShortcut>⌘M</ContextMenuShortcut>
              </ContextMenuItem>
            </DialogTrigger>
            <ContextMenuItem onClick={handleFolderDuplication}>
              Duplicate
              <ContextMenuShortcut>⌘D</ContextMenuShortcut>
            </ContextMenuItem>
            <DialogTrigger
              disabled={isDefault}
              asChild
              onClick={() => setContextMenuDialogWindow("delete")}
            >
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
          {contextMenuDialogWindow === "delete" && (
            <FolderDelete folderId={folderId} setIsOpen={setIsOpen} />
          )}
          {contextMenuDialogWindow === "rename" && (
            <FolderForm
              workspace={workspace || undefined}
              folderId={folderId}
            />
          )}
          {contextMenuDialogWindow === "move" && (
            <MoveForm currentWorkspace={workspace!} folderId={folderId}/>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Folder;
