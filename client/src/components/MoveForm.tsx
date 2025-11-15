import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Field, FieldContent, FieldGroup, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from "./ui/select";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Spinner } from "./ui/spinner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Loader from "./Loader";
import { Folder } from "lucide-react";
import ErrorsPanel from "./ErrorsPanel";
import { toast } from "sonner";

type MoveFormProps = {
  currentWorkspace: Doc<"workspaces">;
  folderId: Id<"folders">;
};

type MoveFormType = z.infer<typeof moveFormSchema>;

const moveFormSchema = z.object({
  from: z.string().min(1, "No Source Workspace Choosen"),
  to: z.string().min(1, "No Destination Workspace Choosen"),
});

const MoveForm = ({ currentWorkspace, folderId }: MoveFormProps) => {
  const workspaces = useQuery(api.workspaces.getUserWorkspaces);
  const moveFolder = useMutation(api.folders.moveFolderToAnotherWorkspace);
  const form = useForm<MoveFormType>({
    resolver: zodResolver(moveFormSchema),
    defaultValues: {
      from: currentWorkspace._id,
      to: "",
    },
  });
  const onFolderMove = async (data: MoveFormType) => {
    try {
      if (currentWorkspace.defaultFolder === folderId) {
        return form.setError("from", {
          message: "Default Folder Cannot Be Moved",
        });
      }
      await moveFolder({
        sourceWorkspaceId: currentWorkspace._id,
        destinationWorkspaceId: data.to as Id<"workspaces">,
        folderId: folderId,
      });
      toast.success("Folder Moved Successfully", {
        position: "bottom-right",
      });
    } catch {
      toast.error("Failed to Move Folder", {
        position: "bottom-right",
        className: "text-destructive",
      });
    }
  };
  return (
    <>
      <form onSubmit={form.handleSubmit(onFolderMove)}>
        <DialogHeader>
          <DialogTitle>Move Folder</DialogTitle>
          <DialogDescription>
            Select the destination workspace where you want to move this folder.
            All files inside the folder will remain unchanged.{" "}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <FieldGroup>
            <Controller
              name="from"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-from">
                      Source Workspace
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={currentWorkspace._id}
                    disabled
                  >
                    <Button
                      variant="outline"
                      disabled
                      className="w-full justify-between"
                    >
                      {currentWorkspace.name}
                    </Button>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="to"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor="form-rhf-to">
                      Destination Workspace
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="form-rhf-to"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Select Destination Workspace" />
                    </SelectTrigger>
                    <SelectContent>
                      {workspaces && workspaces.length > 0 ? (
                        workspaces.map((workspace) => {
                          if (
                            workspace &&
                            workspace._id !== currentWorkspace._id
                          ) {
                            return (
                              <SelectItem
                                key={workspace?._id}
                                value={workspace?._id || ""}
                              >
                                {workspace?.name}
                              </SelectItem>
                            );
                          }
                        })
                      ) : workspaces === undefined ? (
                        <div className="w-full p-6 flex items-center justify-center">
                          <Loader />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6">
                          <div className="bg-muted/40 p-3 rounded-full mb-2">
                            <Folder className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <h2 className="text-sm font-semibold text-muted-foreground mb-1">
                            No Destination Workspaces Found
                          </h2>
                          <p className="text-xs text-muted-foreground/70 max-w-[250px]">
                            Create Workspace First Then Move The Folder
                          </p>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>
          {Object.keys(form.formState.errors).length > 0 && (
            <ErrorsPanel errors={form.formState.errors} />
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Spinner />
                moving
              </>
            ) : (
              "move"
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default MoveForm;
