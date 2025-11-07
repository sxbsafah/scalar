import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { Check, X } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

type NotificationProps = {
  src: string;
  username: string;
  workspaceName: string;
  timestamp: number;
  onAccept: (
    e?: React.MouseEvent<HTMLButtonElement>
  ) => Promise<Id<"memberships">>;
  onDecline: (e?: React.MouseEvent<HTMLButtonElement>) => Promise<null>;
};

const Notification = ({
  src,
  username,
  workspaceName,
  timestamp,
  onAccept,
  onDecline,
}: NotificationProps) => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isDeclineLoading, setIsDeclineLoading] = useState(false);

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 ring-1 ring-border">
          <AvatarImage src={src} alt={`${username}'s avatar`} />
          <AvatarFallback>{username[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight">
          <p className="text-sm text-muted-foreground font-medium">
            <span className="text-card-foreground font-semibold">
              {username}
            </span>{" "}
            invited you to{" "}
            <span className="text-primary font-semibold">{workspaceName}</span>
          </p>
          <span className="text-[12px] text-muted-foreground/70">
            {timestamp} ago
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={async (e) => {
            setIsAcceptLoading(true);
            try {
              const membership = await onAccept(e);
              if (!membership) throw new Error("Failed to accept invitation");
              toast.success(`Joined ${workspaceName}`, {
                position: "bottom-right",
              });
            } catch (err) {
              toast.error((err as Error).message, { position: "bottom-right" });
            } finally {
              setIsAcceptLoading(false);
            }
          }}
          disabled={isAcceptLoading || isDeclineLoading}
          className="flex items-center gap-1 text-sm"
        >
          {isAcceptLoading ? (
            <>
              <Spinner className="w-4 h-4" />
              Processing...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Accept
            </>
          )}
        </Button>

        <Button
          variant="destructive"
          disabled={isDeclineLoading || isAcceptLoading}
          onClick={async (e) => {
            setIsDeclineLoading(true);
            try {
              await onDecline(e);
              toast.info("Invitation declined", { position: "bottom-right" });
            } catch (err) {
              toast.error((err as Error).message, { position: "bottom-right" });
            } finally {
              setIsDeclineLoading(false);
            }
          }}
          className="flex items-center gap-1 text-sm"
        >
          {isDeclineLoading ? (
            <>
              <Spinner className="w-4 h-4" />
              Processing...
            </>
          ) : (
            <>
              <X className="w-4 h-4" />
              Decline
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Notification;
