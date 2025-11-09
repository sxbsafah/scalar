import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { Id } from "convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Check, Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

type InviteProps = {
  children: React.ReactNode;
  users?: {
    username: string;
    profileImageUrl: string;
    plan: "pro" | "free";
    userId: Id<"users">;
    isInvited: boolean;
  }[];
  workspaceId?: Id<"workspaces">;
};

const Invite = ({ children, users, workspaceId }: InviteProps) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const invite = useMutation(api.notifications.createNotification);

  const handleSearching = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite To Workspace</DialogTitle>
          <DialogDescription>
            Invite other users to collaborate in your workspace
          </DialogDescription>
        </DialogHeader>

        {users && (
          <>
            <Input
              placeholder="Search by username..."
              onChange={handleSearching}
              value={username}
              className="mt-2 mb-3"
            />

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
              {users &&
                workspaceId &&
                username.length > 0 &&
                users
                  .filter((user) =>
                    user.username
                      .toLowerCase()
                      .startsWith(username.toLowerCase())
                  )
                  .map((user) => (
                    <div
                      key={user.userId}
                      className="px-3 py-2 border border-border/60 flex items-center justify-between
                                 rounded-xl bg-muted/40 hover:bg-muted/60 transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user.profileImageUrl}
                            alt={user.username}
                            className="rounded-full"
                          />
                          <AvatarFallback>
                            {user.username[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <h1 className="capitalize text-card-foreground font-semibold mb-0.5">
                            {user.username}
                          </h1>
                          <span
                            className="capitalize bg-secondary text-secondary-foreground/80 px-2 py-0.5
                                       rounded-lg text-[11px] font-medium"
                          >
                            {user.plan}
                          </span>
                        </div>
                      </div>

                      {!user.isInvited ? (
                        <Button
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              const notification = await invite({
                                to: user.userId,
                                workspace: workspaceId,
                              });
                              if (!notification)
                                throw new Error("Failed to invite user");
                              toast.success(`Invited ${user.username}`, {
                                position: "bottom-right",
                              });
                            } catch (error) {
                              toast.error((error as Error).message, {
                                position: "bottom-right",
                              });
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          size="sm"
                          className="h-auto px-2 py-1 font-semibold gap-1.5 text-[12px]"
                        >
                          {!isLoading ? (
                            <>
                              <Plus className="w-4 h-4" />
                              Invite
                            </>
                          ): (
                              <>
                                <Spinner />
                                Processing
                              </>
                          )}

                        </Button>
                      ) : (
                        <Check className="text-green-500 w-5 h-5" />
                      )}
                    </div>
                  ))}

                {username.length > 0 &&
                users.filter((u) =>
                  u.username.toLowerCase().startsWith(username.toLowerCase())
                ).length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-6">
                    No users found matching “{username}”
                  </p>
                )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Invite;
