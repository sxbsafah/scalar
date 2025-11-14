import { Dispatch, SetStateAction, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";



const FolderDelete = ({ folderId, setIsOpen }: { folderId: Id<"folders">, setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteFolder = useMutation(api.folders.deleteFolderById);

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
  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your Folder
          and remove everything associated with it.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button onClick={handleDeleteFolder} disabled={isDeleting}>
          {isDeleting ? (
            <>
              Deleting
              <Spinner />
            </>
          ) : (
            "Delete Folder"
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default FolderDelete;
