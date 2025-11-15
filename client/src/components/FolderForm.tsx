import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import {
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

export const folderSchema = z.object({
  name: z.string().min(2, "Folder name must be at least 2 characters long"),
});

type FolderType = z.infer<typeof folderSchema>;

const FolderForm = ({
  workspace,
  folderId,
}: {
  workspace?: Doc<"workspaces">;
  folderId?: Id<"folders">;
}) => {
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
  const upsertFolder = useMutation(api.folders.upsertFolder);

  const handleFolderUpsertion = async ({ name }: FolderType) => {
    try {
      if (workspace) {
        await upsertFolder({
          workspaceId: workspace._id,
          folderName: name,
          folderId: folderId,
        });
        reset({
          name: "",
        }); 
        toast.success(
          `Folder ${folderId ? "updated" : "created"} successfully`,
          {
            position: "bottom-right",
          }
        );
      }
    } catch (err) {
      if (err instanceof ConvexError) {
        setError("name", {
          message: err.data,
        });
      }
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(handleFolderUpsertion)}
      className="space-y-4"
    >
      <DialogHeader>
        <DialogTitle>{folderId ? "Edit Folder" : "Add New Folder"}</DialogTitle>
        <DialogDescription>
          {folderId
            ? "Edit your folder details here. Click save when you're done"
            : "Add new Folder to your workspace here. Click Create when you're done"}
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
              {folderId ? "Saving" : "Creating"}
            </>
          ) : folderId ? (
            "Save"
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default FolderForm;
