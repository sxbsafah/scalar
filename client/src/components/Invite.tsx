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

type InviteProps = {
  children: React.ReactNode;
  users?: { username: string; profileImageUrl: string; plan: "pro" | "free", userId: Id<"users">, isInvited: boolean }[];
  workspaceId?: Id<"workspaces">;
};

const Invite = ({ children, users, workspaceId }: InviteProps) => {
  const [username, setUsername] = useState("");
  const invite = useMutation(api.notifications.createNotification);
  const handleSearching = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite To Workspace</DialogTitle>
          <DialogDescription>
            invite Other Users To Your Workspace
          </DialogDescription>
        </DialogHeader>
        {users && (
          <>
            <Input onChange={(e) => handleSearching(e)} value={username} />
            <div className="flex flex-col gap-2">
              {users && workspaceId && username.length > 0 &&
                users.filter(user => user.username.toLowerCase().startsWith(username.toLowerCase())).map((user) => (
                  <div className="px-3 py-2 border border-border flex items-center justify-between rounded-2xl bg-card" key={user.userId}>
                    <div className="flex items-center gap-3">
                      <Avatar >
                        <AvatarImage src={user.profileImageUrl} width={40} height={40} className="rounded-full"/>
                        <AvatarFallback>User Not Found</AvatarFallback>
                      </Avatar>
                      <div className="">
                        <h1 className="capitalize text-card-foreground font-medium mb-1">
                          {user.username}
                        </h1>
                        <div className="capitalize bg-primary text-primary-foreground px-3 rounded-xl  font-medium py-0 text-[12px] flex items-center justify-center">
                          {user.plan}
                        </div>
                      </div>
                    </div>
                    {!user.isInvited ? (
                      <Button onClick={async () => {
                        try {
                          const notification = await invite({ to: user.userId, workspace: workspaceId })
                          if (!notification) {
                            throw new Error("Failed to invite user");
                          }
                        } catch (error) {
                          toast.error("(error as Error).message", {
                            position: "bottom-right",
                          })
                        }
                      }} size={"sm"} className="h-auto px-2 py-1 font-semibold gap-1.5 text-[12px]">
                        <Plus />
                        Invite
                      </Button>
                    ) : (
                        <Check className="text-muted-foreground"/>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Invite;
